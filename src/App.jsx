import React, { useEffect, useCallback, useReducer } from "react";
import TodoList from "./features/TodoList/TodoList";
import TodoForm from "./features/TodoForm";
import TodosViewForm from "./features/TodosViewForm.jsx";
import "./App.css";
import styles from "./App.module.css";
import logo from "./assets/logo.png";
import error from "./assets/error.png";

import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from "./reducers/todos.reducer";

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

  const {
    todoList,
    isLoading,
    errorMessage,
    isSaving,
    sortField,
    sortDirection,
    queryString,
  } = todoState;

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  const createOptions = useCallback(
    (method, payload) => ({
      method,
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }),
    [token]
  );

  const encodeUrl = useCallback(() => {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = "";
    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}",title)`;
    }
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [sortField, sortDirection, queryString, url]);

  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: todoActions.fetchTodos });
      try {
        const options = {
          method: "GET",
          headers: {
            Authorization: token,
          },
        };
        const resp = await fetch(encodeUrl(), options);
        if (!resp.ok) {
          throw new Error(`HTTP error! Status: ${resp.status}`);
        }

        const { records } = await resp.json();
        dispatch({ type: todoActions.loadTodos, records });
      } catch (error) {
        dispatch({ type: todoActions.setLoadError, error });
      }
    };

    fetchTodos();
  }, [encodeUrl, token]);

  const handleAddTodo = async (newTodoTitle) => {
    const payload = {
      records: [
        {
          fields: {
            title: newTodoTitle,
            isCompleted: false,
          },
        },
      ],
    };
    const options = createOptions("POST", payload);
    const requestUrl = url;

    dispatch({ type: todoActions.startRequest });
    try {
      const resp = await fetch(requestUrl, options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }
      const { records } = await resp.json();
      dispatch({ type: todoActions.addTodo, record: records[0] });
    } catch (error) {
      console.error("Error adding todo:", error);
      dispatch({ type: todoActions.setLoadError, error });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    if (!originalTodo) return;

    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };

    const options = createOptions("PATCH", payload);
    const requestUrl = url;

    dispatch({ type: todoActions.updateTodo, todo: editedTodo });
    dispatch({ type: todoActions.startRequest });

    try {
      const resp = await fetch(`${requestUrl}/${editedTodo.id}`, options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }
    } catch (error) {
      console.error("Error updating todo:", error);
      dispatch({
        type: todoActions.setLoadError,
        error: new Error(`${error.message}. Reverting todo...`),
      });
      dispatch({ type: todoActions.revertTodo, originalTodo });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  const completeTodo = async (id) => {
    const originalTodo = todoList.find((todo) => todo.id === id);
    if (!originalTodo) return;

    dispatch({ type: todoActions.completeTodo, id });
    dispatch({ type: todoActions.startRequest });

    const payload = {
      records: [
        {
          id: id,
          fields: {
            isCompleted: !originalTodo.isCompleted,
          },
        },
      ],
    };

    const options = createOptions("PATCH", payload);
    const requestUrl = url;

    try {
      const resp = await fetch(`${requestUrl}/${id}`, options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }
    } catch (error) {
      console.error("Error updating todo completion:", error);
      dispatch({
        type: todoActions.setLoadError,
        error: new Error(
          `${error.message}. Reverting todo completion status...`
        ),
      });
      dispatch({ type: todoActions.revertTodo, originalTodo });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  const deleteTodo = async (id) => {
    const originalTodosListAfterOptimisticDelete = todoList.filter(
      (todo) => todo.id !== id
    );
    const originalTodoItem = todoList.find((todo) => todo.id === id);

    dispatch({
      type: todoActions.revertTodo,
      originalTodos: originalTodosListAfterOptimisticDelete,
    });
    dispatch({ type: todoActions.startRequest });

    const requestUrl = url;

    try {
      const resp = await fetch(`${requestUrl}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      if (!resp.ok) {
        throw new Error(resp.message);
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      dispatch({
        type: todoActions.setLoadError,
        error: new Error(`${error.message}. Reverting deletion...`),
      });
      dispatch({
        type: todoActions.revertTodo,
        originalTodo: originalTodoItem,
      });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  const handleDismissError = () => {
    dispatch({ type: todoActions.clearError });
  };

  return (
    <div className={styles.app}>
      <div className={styles.appHeader}>
        <img src={logo} alt="Logo" className={styles.appLogo} />
        <h1>My Todos</h1>
      </div>

      <TodoForm onAddTodo={handleAddTodo} isSaving={isSaving} />

      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        onDeleteTodo={deleteTodo}
        isLoading={isLoading}
      />

      <hr className={styles.separator} />

      <TodosViewForm
        sortField={sortField}
        setSortField={(value) =>
          dispatch({ type: todoActions.setSortField, field: value })
        }
        sortDirection={sortDirection}
        setSortDirection={(value) =>
          dispatch({ type: todoActions.setSortDirection, direction: value })
        }
        queryString={queryString}
        setQueryStringSetter={(value) =>
          dispatch({ type: todoActions.setQueryString, query: value })
        }
      />

      {errorMessage && (
        <div className={styles.errorContainer}>
          <img src={error} alt="Error Icon" className={styles.errorIcon} />
          <p>{errorMessage}</p>
          <button onClick={handleDismissError}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default App;

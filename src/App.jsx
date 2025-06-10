import React, { useEffect, useCallback, useReducer, useState } from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import TodosPage from "./pages/TodosPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
import Header from "./shared/Header";
import "./App.css";
import styles from "./App.module.css";

import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from "./reducers/todos.reducer";

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);
  const [pageTitle, setPageTitle] = useState("");
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
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

  useEffect(() => {
    if (location.pathname === "/") {
      setPageTitle("Todo List");
    } else if (location.pathname === "/about") {
      setPageTitle("About");
    } else {
      setPageTitle("Not Found");
    }
  }, [location]);
  const itemsPerPage = 15;
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const filteredByQuery = queryString
    ? todoList.filter((todo) =>
        todo.title.toLowerCase().includes(queryString.toLowerCase())
      )
    : todoList;
  const sortedTodoList = [...filteredByQuery].sort((a, b) => {
    if (sortField === "createdTime") {
      return sortDirection === "asc"
        ? new Date(a.createdTime) - new Date(b.createdTime)
        : new Date(b.createdTime) - new Date(a.createdTime);
    } else if (sortField === "title") {
      return sortDirection === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
    return 0;
  });
  const totalPages = Math.ceil(sortedTodoList.length / itemsPerPage);
  const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
  const paginatedAndFilteredTodos = sortedTodoList.slice(
    indexOfFirstTodo,
    indexOfFirstTodo + itemsPerPage
  );
  const handlePreviousPage = useCallback(() => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set("page", Math.max(1, currentPage - 1).toString());
      return newParams;
    });
  }, [currentPage, setSearchParams]);
  const handleNextPage = useCallback(() => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set("page", Math.min(totalPages, currentPage + 1).toString());
      return newParams;
    });
  }, [currentPage, totalPages, setSearchParams]);
  useEffect(() => {
    if (
      totalPages > 0 &&
      (isNaN(currentPage) || currentPage < 1 || currentPage > totalPages)
    ) {
      navigate("/");
    }
  }, [currentPage, totalPages, navigate]);
  const handleAddTodo = useCallback(
    async (newTodoTitle) => {
      const payload = {
        records: [{ fields: { title: newTodoTitle, isCompleted: false } }],
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
        setSearchParams((prevParams) => {
          const newParams = new URLSearchParams(prevParams);
          newParams.set(
            "page",
            Math.ceil((todoList.length + 1) / itemsPerPage).toString()
          );
          return newParams;
        });
      } catch (error) {
        console.error("Error adding todo:", error);
        dispatch({ type: todoActions.setLoadError, error });
      } finally {
        dispatch({ type: todoActions.endRequest });
      }
    },
    [
      createOptions,
      dispatch,
      url,
      todoList.length,
      itemsPerPage,
      setSearchParams,
    ]
  );
  const updateTodo = useCallback(
    async (editedTodo) => {
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

      dispatch({ type: todoActions.updateTodo, editedTodo: editedTodo });
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
    },
    [createOptions, dispatch, todoList, url]
  );
  const completeTodo = useCallback(
    async (id) => {
      const originalTodo = todoList.find((todo) => todo.id === id);
      if (!originalTodo) return;

      dispatch({ type: todoActions.completeTodo, id });
      dispatch({ type: todoActions.startRequest });

      const payload = {
        records: [
          { id: id, fields: { isCompleted: !originalTodo.isCompleted } },
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
    },
    [createOptions, dispatch, todoList, url]
  );

  const deleteTodo = useCallback(
    async (id) => {
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
          headers: { Authorization: token },
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
    },
    [dispatch, todoList, token, url]
  );
  const handleDismissError = useCallback(() => {
    dispatch({ type: todoActions.clearError });
  }, [dispatch]);
  return (
    <div className={styles.app}>
      <Header title={pageTitle} />

      <Routes>
        <Route
          path="/"
          element={
            <TodosPage
              todoList={paginatedAndFilteredTodos}
              isLoading={isLoading}
              errorMessage={errorMessage}
              isSaving={isSaving}
              sortField={sortField}
              sortDirection={sortDirection}
              queryString={queryString}
              dispatch={dispatch}
              handleAddTodo={handleAddTodo}
              updateTodo={updateTodo}
              completeTodo={completeTodo}
              deleteTodo={deleteTodo}
              handleDismissError={handleDismissError}
              todoActions={todoActions}
              currentPage={currentPage}
              totalPages={totalPages}
              onPreviousPage={handlePreviousPage}
              onNextPage={handleNextPage}
            />
          }
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;

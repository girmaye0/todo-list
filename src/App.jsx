import React, { useState, useEffect } from "react";
import TodoList from "./features/TodoList/TodoList";
import TodoForm from "./features/TodoForm";
import "./App.css";

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      try {
        const resp = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: token,
          },
        });

        if (!resp.ok) {
          throw new Error(resp.message);
        }

        const { records } = await resp.json();
        const fetchedTodos = records.map((record) => {
          const todo = {
            id: record.id,
            title: record.fields.title || "",
            isCompleted: record.fields.isCompleted || false,
          };
          return todo;
        });
        setTodoList(fetchedTodos);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

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
    const options = {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    try {
      setIsSaving(true);
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }
      const { records } = await resp.json();
      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };
      if (!savedTodo.isCompleted) {
        savedTodo.isCompleted = false;
      }
      setTodoList((prevTodos) => [...prevTodos, savedTodo]);
    } catch (error) {
      console.error("Error adding todo:", error);
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
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

    const options = {
      method: "PATCH",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    // Optimistic update
    setTodoList((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === editedTodo.id
          ? {
              ...todo,
              title: editedTodo.title,
              isCompleted: editedTodo.isCompleted,
            }
          : todo
      )
    );

    try {
      setIsSaving(true);
      const resp = await fetch(`${url}/${editedTodo.id}`, options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }
      const { records } = await resp.json();
      const updatedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };
      if (!updatedTodo.isCompleted) {
        updatedTodo.isCompleted = false;
      }
      const updatedTodos = todoList.map((todo) =>
        todo.id === updatedTodo.id ? { ...updatedTodo } : todo
      );
      setTodoList([...updatedTodos]);
    } catch (error) {
      console.error("Error updating todo:", error);
      setErrorMessage(`${error.message}. Reverting todo...`);
      const revertedTodos = todoList.map((todo) =>
        todo.id === originalTodo.id ? { ...originalTodo } : todo
      );
      setTodoList([...revertedTodos]);
    } finally {
      setIsSaving(false);
    }
  };

  const completeTodo = async (id) => {
    const originalTodo = todoList.find((todo) => todo.id === id);
    if (!originalTodo) return;

    const updatedIsCompleted = !originalTodo.isCompleted;

    // Optimistic update
    setTodoList((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: updatedIsCompleted } : todo
      )
    );

    const payload = {
      records: [
        {
          id: id,
          fields: {
            isCompleted: updatedIsCompleted,
          },
        },
      ],
    };

    const options = {
      method: "PATCH",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    try {
      setIsSaving(true);
      const resp = await fetch(`${url}/${id}`, options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }
      // No need to update state again optimistically, it's already done
    } catch (error) {
      console.error("Error updating todo completion:", error);
      setErrorMessage(`${error.message}. Reverting todo completion status...`);
      const revertedTodos = todoList.map((todo) =>
        todo.id === originalTodo.id ? { ...originalTodo } : todo
      );
      setTodoList([...revertedTodos]);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteTodo = async (id) => {
    const originalTodos = [...todoList];

    setTodoList((prevTodos) => prevTodos.filter((todo) => todo.id !== id));

    try {
      setIsSaving(true);
      const resp = await fetch(`${url}/${id}`, {
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
      setErrorMessage(`${error.message}. Reverting deletion...`);
      setTodoList(originalTodos);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDismissError = () => {
    setErrorMessage("");
  };

  if (isLoading) {
    return <div>Loading todos... Please wait.</div>;
  }

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={handleAddTodo} isSaving={isSaving} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        onDeleteTodo={deleteTodo}
        isLoading={isLoading}
      />
      {errorMessage && (
        <div>
          <hr />
          <p>{errorMessage}</p>
          <button onClick={handleDismissError}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default App;

import React, { useState, useEffect, useCallback } from "react";
import TodoList from "./features/TodoList/TodoList";
import TodoForm from "./features/TodoForm";
import TodosViewForm from "./features/TodosViewForm.jsx";
import "./App.css";

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [sortField, setSortField] = useState("createdTime"); // Initial sort field
  const [sortDirection, setSortDirection] = useState("desc"); // Initial sort direction
  const [queryString, setQueryString] = useState(""); // Added state for search query

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
      console.log(searchQuery);
    }
    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [sortField, sortDirection, queryString]);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      try {
        const options = {
          // Store fetch options
          method: "GET",
          headers: {
            Authorization: token,
          },
        };
        const resp = await fetch(encodeUrl(), options); // Use encodeUrl() directly
        if (!resp.ok) {
          throw new Error(`HTTP error! Status: ${resp.status}`);
        }

        const { records } = await resp.json();
        const fetchedTodos = records.map((record) => ({
          id: record.id,
          ...record.fields,
          isCompleted: record.fields.isCompleted || false,
        }));
        setTodoList(fetchedTodos);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, [encodeUrl]); // Removed token

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
    const requestUrl = encodeUrl();

    try {
      setIsSaving(true);
      const resp = await fetch(requestUrl, options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }
      const { records } = await resp.json();
      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
        isCompleted: records[0].fields.isCompleted || false,
      };
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

    const options = createOptions("PATCH", payload);
    const requestUrl = encodeUrl();

    setTodoList((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === editedTodo.id ? { ...editedTodo } : todo
      )
    );

    try {
      setIsSaving(true);
      const resp = await fetch(`${requestUrl}/${editedTodo.id}`, options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }
      const { records } = await resp.json();
      const updatedTodo = {
        id: records[0].id,
        ...records[0].fields,
        isCompleted: records[0].fields.isCompleted || false,
      };
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

    const options = createOptions("PATCH", payload);
    const requestUrl = encodeUrl();

    try {
      setIsSaving(true);
      const resp = await fetch(`${requestUrl}/${id}`, options);
      if (!resp.ok) {
        throw new Error(resp.message);
      }
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
    const requestUrl = encodeUrl();

    setTodoList((prevTodos) => prevTodos.filter((todo) => todo.id !== id));

    try {
      setIsSaving(true);
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
      setErrorMessage(`${error.message}. Reverting deletion...`);
      setTodoList(originalTodos);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDismissError = () => {
    setErrorMessage("");
  };

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
      <hr />
      <TodosViewForm
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        queryString={queryString}
        setQueryString={setQueryString}
      />
      {errorMessage && (
        <div>
          <p>{errorMessage}</p>
          <button onClick={handleDismissError}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default App;

// import React, { useState, useEffect, useCallback } from "react";
// import TodoList from "./features/TodoList/TodoList";
// import TodoForm from "./features/TodoForm";
// import TodosViewForm from "./features/TodosViewForm";
// import "./App.css";

// const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;

// function App() {
//   const [todoList, setTodoList] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [isSaving, setIsSaving] = useState(false);
//   const [sortField, setSortField] = useState("createdTime");
//   const [sortDirection, setSortDirection] = useState("desc");
//   const [queryString, setQueryString] = useState("");

//   const token = `Bearer ${import.meta.env.VITE_PAT}`;

//   const createOptions = useCallback(
//     (method, payload) => ({
//       method,
//       headers: {
//         Authorization: token,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     }),
//     [token]
//   );

//   const encodeUrl = useCallback(() => {
//     let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
//     let searchQuery = "";
//     if (queryString) {
//       searchQuery = `&filterByFormula=SEARCH("${queryString}",title)`;
//       console.log(searchQuery);
//     }
//     return encodeURI(`${url}?${sortQuery}${searchQuery}`);
//   }, [sortField, sortDirection, queryString, url]);

//   useEffect(() => {
//     const fetchTodos = async () => {
//       setIsLoading(true);
//       try {
//         const sortedUrl = encodeUrl();
//         const resp = await fetch(sortedUrl, {
//           method: "GET",
//           headers: {
//             Authorization: token,
//           },
//         });

//         if (!resp.ok) {
//           throw new Error(`HTTP error! Status: ${resp.status}`);
//         }

//         const { records } = await resp.json();
//         const fetchedTodos = records.map((record) => ({
//           id: record.id,
//           ...record.fields,
//           isCompleted: record.fields.isCompleted || false,
//         }));
//         setTodoList(fetchedTodos);
//       } catch (error) {
//         setErrorMessage(error.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchTodos();
//   }, [sortField, sortDirection, queryString, token, encodeUrl]);

//   const handleAddTodo = async (newTodoTitle) => {
//     const payload = {
//       records: [
//         {
//           fields: {
//             title: newTodoTitle,
//             isCompleted: false,
//           },
//         },
//       ],
//     };
//     const options = createOptions("POST", payload);
//     const requestUrl = encodeUrl();

//     try {
//       setIsSaving(true);
//       const resp = await fetch(requestUrl, options);
//       if (!resp.ok) {
//         throw new Error(resp.message);
//       }
//       const { records } = await resp.json();
//       const savedTodo = {
//         id: records[0].id,
//         ...records[0].fields,
//         isCompleted: records[0].fields.isCompleted || false,
//       };
//       setTodoList((prevTodos) => [...prevTodos, savedTodo]);
//     } catch (error) {
//       console.error("Error adding todo:", error);
//       setErrorMessage(error.message);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const updateTodo = async (editedTodo) => {
//     const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
//     if (!originalTodo) return;

//     const payload = {
//       records: [
//         {
//           id: editedTodo.id,
//           fields: {
//             title: editedTodo.title,
//             isCompleted: editedTodo.isCompleted,
//           },
//         },
//       ],
//     };

//     const options = createOptions("PATCH", payload);

//     try {
//       setIsSaving(true);
//       const resp = await fetch(`${url}/${editedTodo.id}`, options);
//       if (!resp.ok) {
//         throw new Error(resp.message);
//       }
//       const { records } = await resp.json();
//       const updatedTodo = {
//         id: records[0].id,
//         ...records[0].fields,
//         isCompleted: records[0].fields.isCompleted || false,
//       };
//       const updatedTodos = todoList.map((todo) =>
//         todo.id === updatedTodo.id ? { ...updatedTodo } : todo
//       );
//       setTodoList([...updatedTodos]);
//     } catch (error) {
//       console.error("Error updating todo:", error);
//       setErrorMessage(`${error.message}. Reverting todo...`);
//       const revertedTodos = todoList.map((todo) =>
//         todo.id === originalTodo.id ? { ...originalTodo } : todo
//       );
//       setTodoList([...revertedTodos]);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const completeTodo = async (id) => {
//     const originalTodo = todoList.find((todo) => todo.id === id);
//     if (!originalTodo) return;

//     const updatedIsCompleted = !originalTodo.isCompleted;

//     setTodoList((prevTodos) =>
//       prevTodos.map((todo) =>
//         todo.id === id ? { ...todo, isCompleted: updatedIsCompleted } : todo
//       )
//     );

//     const payload = {
//       records: [
//         {
//           id: id,
//           fields: {
//             isCompleted: updatedIsCompleted,
//           },
//         },
//       ],
//     };

//     const options = createOptions("PATCH", payload);

//     try {
//       setIsSaving(true);
//       const resp = await fetch(`${url}/${id}`, options);
//       if (!resp.ok) {
//         throw new Error(resp.message);
//       }
//     } catch (error) {
//       console.error("Error updating todo completion:", error);
//       setErrorMessage(`${error.message}. Reverting todo completion status...`);
//       const revertedTodos = todoList.map((todo) =>
//         todo.id === originalTodo.id ? { ...originalTodo } : todo
//       );
//       setTodoList([...revertedTodos]);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const deleteTodo = async (id) => {
//     const originalTodos = [...todoList];

//     try {
//       setIsSaving(true);
//       const resp = await fetch(`${url}/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: token,
//         },
//       });

//       if (!resp.ok) {
//         throw new Error(resp.message);
//       }
//       setTodoList((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
//     } catch (error) {
//       console.error("Error deleting todo:", error);
//       setErrorMessage(`${error.message}. Reverting deletion...`);
//       setTodoList(originalTodos);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleDismissError = () => {
//     setErrorMessage("");
//   };

//   if (isLoading) {
//     return <div>Loading todos... Please wait.</div>;
//   }

//   return (
//     <div>
//       <h1>My Todos</h1>
//       <TodoForm onAddTodo={handleAddTodo} isSaving={isSaving} />
//       <TodoList
//         todoList={todoList}
//         onCompleteTodo={completeTodo}
//         onUpdateTodo={updateTodo}
//         onDeleteTodo={deleteTodo}
//         isLoading={isLoading}
//       />
//       <hr />
//       <TodosViewForm
//         sortField={sortField}
//         setSortField={setSortField}
//         sortDirection={sortDirection}
//         setSortDirection={setSortDirection}
//         queryString={queryString}
//         setQueryString={setQueryString}
//       />
//       {errorMessage && (
//         <div>
//           <p>{errorMessage}</p>
//           <button onClick={handleDismissError}>Dismiss</button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;

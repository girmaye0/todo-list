// import { useRef } from "react"; // Import useRef

// function TodoForm({ onAddTodo }) {
//   const todoTitleInput = useRef(""); // Create ref

//   const handleAddTodo = (event) => {
//     event.preventDefault();
//     const title = event.target.title.value;
//     const id = Date.now();
//     const isCompleted = false;
//     onAddTodo({ title, id, isCompleted });

//     event.target.title.value = "";
//     todoTitleInput.current.focus(); // Focus input after adding todo
//   };

//   return (
//     <form onSubmit={handleAddTodo}>
//       <label htmlFor="todoTitle">Todo</label>
//       <input
//         type="text"
//         id="todoTitle"
//         name="title"
//         ref={todoTitleInput}
//       />{" "}
//       {/* Add ref */}
//       <button type="submit">Add Todo</button>
//     </form>
//   );
// }

// export default TodoForm;

import { useRef, useState } from "react"; // Import useState and useRef

function TodoForm({ onAddTodo }) {
  const [inputValue, setInputValue] = useState(""); // State to track input value
  const todoTitleInput = useRef(null); // Create ref

  const handleAddTodo = (event) => {
    event.preventDefault();
    const title = inputValue.trim(); // Use trimmed inputValue
    const id = Date.now();
    const isCompleted = false;
    onAddTodo({ title, id, isCompleted });

    setInputValue(""); // Clear input value after submission
    todoTitleInput.current.focus(); // Focus input after adding todo
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value); // Update input value
  };

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input
        type="text"
        id="todoTitle"
        name="title"
        value={inputValue} // Controlled input
        onChange={handleInputChange} // Track changes
        ref={todoTitleInput} // Add ref
      />
      <button type="submit" disabled={!inputValue.trim()}>
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;

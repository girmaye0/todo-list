import React, { useState, useRef } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";

function TodoForm({ onAddTodo }) {
  const [title, setTitle] = useState(""); // State to manage the input value
  const todoTitleInput = useRef(null);

  const handleInputChange = (event) => {
    setTitle(event.target.value); // Update the local state on input change
  };

  const handleAddTodo = (event) => {
    event.preventDefault();
    if (title.trim()) {
      const id = Date.now();
      const isCompleted = false;
      onAddTodo({ title, id, isCompleted });
      setTitle(""); // Clear the input state after adding todo
      todoTitleInput.current.focus();
    }
  };

  return (
    <form onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId="todoTitle"
        label="Todo"
        value={title} // Bind the input value to the state
        ref={todoTitleInput}
        onChange={handleInputChange} // Use handleInputChange to update state
      />
      <button type="submit" disabled={title.trim() === ""}>
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;

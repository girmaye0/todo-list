import React, { useState, useRef } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel";

function TodoForm({ onAddTodo, isSaving }) {
  const [title, setTitle] = useState("");
  const todoTitleInput = useRef(null);

  const handleInputChange = (event) => {
    setTitle(event.target.value);
  };

  const handleAddTodo = (event) => {
    event.preventDefault();
    if (title.trim()) {
      onAddTodo(title.trim());
      setTitle("");
      todoTitleInput.current.focus();
    }
  };

  return (
    <form onSubmit={handleAddTodo}>
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <TextInputWithLabel
          elementId="todoTitle"
          label="Todo"
          value={title}
          ref={todoTitleInput}
          onChange={handleInputChange}
        />
        <button type="submit" disabled={title.trim() === "" || isSaving}>
          {isSaving ? "Adding..." : "Add Todo"}
        </button>
      </div>
    </form>
  );
}

export default TodoForm;

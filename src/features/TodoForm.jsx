import React, { useState, useRef } from "react";
import styled from "styled-components";
import TextInputWithLabel from "../shared/TextInputWithLabel";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-bottom: 10px;
  margin-bottom: 20px;
  width: 100%;
`;

const StyledButton = styled.button`
  padding: 10px 10px;
  border: none;
  border-radius: 5px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;
  margin-left: 8px;

  &:hover {
    background-color: #367c39;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    font-style: italic;
  }
`;

const StyledInputAndButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%; /* Ensure this container takes full width */
`;

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
    <StyledForm onSubmit={handleAddTodo}>
      <StyledInputAndButtonContainer>
        <TextInputWithLabel
          elementId="todoTitle"
          label="Todo"
          value={title}
          ref={todoTitleInput}
          onChange={handleInputChange}
          style={{
            flex: 1,
          }}
        />
        <StyledButton
          className="add-todo-button"
          type="submit"
          disabled={title.trim() === "" || isSaving}
        >
          {isSaving ? "Adding..." : "Add Todo"}
        </StyledButton>
      </StyledInputAndButtonContainer>
    </StyledForm>
  );
}

export default TodoForm;

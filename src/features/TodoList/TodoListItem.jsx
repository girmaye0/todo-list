import React, { useState, useRef, useEffect } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  // Destructure onUpdateTodo
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);
  const editInputRef = useRef(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const handleEdit = (event) => {
    setWorkingTitle(event.target.value);
  };

  const handleUpdate = (event) => {
    if (!isEditing) {
      return;
    }
    event.preventDefault();
    if (workingTitle.trim()) {
      onUpdateTodo({ ...todo, title: workingTitle }); // Correctly call onUpdateTodo
      setIsEditing(false);
    } else {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  };

  return (
    <li>
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <TextInputWithLabel
            value={workingTitle}
            onChange={handleEdit}
            ref={editInputRef}
            elementId={`editInput-${todo.id}`}
          />
          <button type="submit">Update</button>{" "}
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </form>
      ) : (
        <form>
          <label>
            <input
              type="checkbox"
              id={`checkbox${todo.id}`}
              checked={todo.isCompleted}
              onChange={() => onCompleteTodo(todo.id)}
            />
          </label>
          <span onClick={() => setIsEditing(true)}>{todo.title}</span>
        </form>
      )}
    </li>
  );
}

export default TodoListItem;

import React, { useState, useRef, useEffect } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo, onDeleteTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);
  const editInputRef = useRef(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setWorkingTitle(todo.title);
  }, [todo]);

  const handleEdit = (event) => {
    setWorkingTitle(event.target.value);
  };

  const handleUpdate = () => {
    if (isEditing && workingTitle.trim() && workingTitle !== todo.title) {
      onUpdateTodo({
        id: todo.id,
        title: workingTitle.trim(),
        isCompleted: todo.isCompleted,
      });
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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TextInputWithLabel
            style={{ flexGrow: 1, marginRight: "8px" }}
            value={workingTitle}
            onChange={handleEdit}
            ref={editInputRef}
            elementId={`editInput-${todo.id}`}
          />
          <button type="button" onClick={handleUpdate}>
            Update
          </button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <label style={{ marginRight: "8px" }}>
            <input
              type="checkbox"
              id={`checkbox${todo.id}`}
              checked={todo.isCompleted}
              onChange={() => onCompleteTodo(todo.id)}
            />
          </label>
          <span
            style={{ marginRight: "8px" }}
            onClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>
        </div>
      )}
    </li>
  );
}

export default TodoListItem;

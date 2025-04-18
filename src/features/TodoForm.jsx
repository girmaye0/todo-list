import { useRef } from "react";

function TodoForm({ onAddTodo }) {
  const todoTitleInput = useRef("");

  const handleAddTodo = (event) => {
    event.preventDefault();
    const title = event.target.title.value;
    const id = Date.now();
    const isCompleted = false;
    onAddTodo({ title, id, isCompleted });

    event.target.title.value = "";
    todoTitleInput.current.focus();
  };

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input
        type="text"
        id="todoTitle"
        name="title"
        ref={todoTitleInput}
      />{" "}
      {/* Add ref */}
      <button type="submit">Add Todo</button>
    </form>
  );
}

export default TodoForm;

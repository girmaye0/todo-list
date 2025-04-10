import { useRef } from "react"; // Import useRef

function TodoForm({ onAddTodo }) {
  const todoTitleInput = useRef(""); // Create ref

  const handleAddTodo = (event) => {
    event.preventDefault();
    const title = event.target.title.value;
    const id = Date.now();
    onAddTodo({title, id});

    event.target.title.value = "";
    todoTitleInput.current.focus(); // Focus input after adding todo
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

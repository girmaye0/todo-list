import "./App.css";
import TodoList from "./TodoList";
import TodoForm from "./TodoForm";
import { useState } from "react"; // Import useState

function App() {
  const [newTodo, setNewTodo] = useState("Todo to be added:"); // Create state

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm />
      <p>{newTodo}</p>
      <TodoList />
    </div>
  );
}

export default App;

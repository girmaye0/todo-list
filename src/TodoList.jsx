import TodoListItem from "./TodoListItem";

function TodoList() {
  const todos = [
    // Corrected variable name to 'todos'
    { id: 1, title: "Reading week-03 module" },
    { id: 2, title: "Attending Mentor sessions" },
    { id: 3, title: "Props and State" },
    { id: 4, title: "Starting week-03 module" },
  ];

  return (
    <div>
      <ul>
        {todos.map((todo) => (
          <TodoListItem todo={todo} key={todo.id} /> // Corrected key and self-closing tag
        ))}
      </ul>
    </div>
  );
}

export default TodoList;

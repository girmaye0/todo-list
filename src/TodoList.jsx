function TodoList() {
  const todos = [
    { id: 1, title: "Reading week-01 module" },
    { id: 2, title: "Attending Mentor session" },
    { id: 3, title: "ABCs of react-vite" },
    { id: 4, title: "Starting week-02 module" },
  ];

  return (
    <div>
      <ul>
        {todos.map((todos) => (
          <li key={todos.id}>{todos.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;

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
      <ol>
        {todos.map((todo) => (
          <TodoListItem todo={todo} key={todo.id} /> // Corrected key and self-closing tag
        ))}
      </ol>
    </div>
  );
}

export default TodoList;











// function TodoList() {
//   const todos = [
//     { id: 1, title: "Reading week-01 module" },
//     { id: 2, title: "Attending Mentor session" },
//     { id: 3, title: "ABCs of react-vite" },
//     { id: 4, title: "Starting week-02 module" },
//   ];

//   return (
//     <div>
//       <ul>
//         {todos.map((todos) => (
//           <li key={todos.id}>{todos.title}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default TodoList;

function TodoListItem({ todo, onCompleteTodo }) {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.isCompleted}
        onChange={() => onCompleteTodo(todo.id)}
        style={{ display: "inline-block", marginRight: "8px" }}
      />
      <form style={{ display: "inline-block" }}>{todo.title}</form>
    </li>
  );
}

export default TodoListItem;

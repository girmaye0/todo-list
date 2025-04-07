function TodoListItem({ todo }) {
  return (
    <li>{todo.title}- key: {todo.id}</li> // Parentheses prevent ASI
  );
}

export default TodoListItem;

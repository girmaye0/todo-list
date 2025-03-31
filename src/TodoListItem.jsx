function TodoListItem({ todo }) {
  return (
    <li>{todo.title}</li> // Parentheses prevent ASI
  );
}

export default TodoListItem;

import React from "react";
import TodoListItem from "./TodoListItem";
import styles from "./TodoList.module.css";

function TodoList({
  todoList,
  onCompleteTodo,
  onUpdateTodo,
  onDeleteTodo,
  isLoading,
}) {
  return (
    <>
      {isLoading ? (
        <p>Todo list loading...</p>
      ) : todoList.length === 0 ? (
        <p>No todos yet!</p>
      ) : (
        <ul className={styles.todoList}>
          {todoList.map((todo) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              onCompleteTodo={onCompleteTodo}
              onUpdateTodo={onUpdateTodo}
              onDeleteTodo={onDeleteTodo}
            />
          ))}
        </ul>
      )}
    </>
  );
}

export default TodoList;

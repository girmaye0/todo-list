import React from "react";
import TodoList from "../features/TodoList/TodoList";
import TodoForm from "../features/TodoForm";
import TodosViewForm from "../features/TodosViewForm.jsx";
import styles from "../App.module.css";
import logo from "../assets/logo.png";
import error from "../assets/error.png";

function TodosPage({
  todoList,
  isLoading,
  errorMessage,
  isSaving,
  sortField,
  sortDirection,
  queryString,
  dispatch,
  handleAddTodo,
  updateTodo,
  completeTodo,
  deleteTodo,
  handleDismissError,
  todoActions,
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
}) {
  return (
    <>
      {/* <div className={styles.appHeader}>
        <img src={logo} alt="Logo" className={styles.appLogo} />
        <h1>My Todos</h1>
      </div> */}

      <TodoForm onAddTodo={handleAddTodo} isSaving={isSaving} />

      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        onDeleteTodo={deleteTodo}
        isLoading={isLoading}
      />

      <div className={styles.paginationControls}>
        <button
          onClick={onPreviousPage}
          disabled={currentPage === 1}
          className={styles.paginationButton}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className={styles.paginationButton}
        >
          Next
        </button>
      </div>

      <hr className={styles.separator} />

      <TodosViewForm
        sortField={sortField}
        setSortField={(value) =>
          dispatch({ type: todoActions.setSortField, field: value })
        }
        sortDirection={sortDirection}
        setSortDirection={(value) =>
          dispatch({ type: todoActions.setSortDirection, direction: value })
        }
        queryString={queryString}
        setQueryStringSetter={(value) =>
          dispatch({ type: todoActions.setQueryString, query: value })
        }
      />

      {errorMessage && (
        <div className={styles.errorContainer}>
          <img src={error} alt="Error Icon" className={styles.errorIcon} />
          <p>{errorMessage}</p>
          <button onClick={handleDismissError}>Dismiss</button>
        </div>
      )}
    </>
  );
}

export default TodosPage;

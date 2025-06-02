const actions = {
  fetchTodos: "FETCH_TODOS",
  loadTodos: "LOAD_TODOS",
  addTodo: "ADD_TODO",
  updateTodo: "UPDATE_TODO",
  completeTodo: "COMPLETE_TODO",
  revertTodo: "REVERT_TODO",
  startRequest: "START_REQUEST",
  endRequest: "END_REQUEST",
  setLoadError: "SET_LOAD_ERROR",
  clearError: "CLEAR_ERROR",
  setSortField: "SET_SORT_FIELD",
  setSortDirection: "SET_SORT_DIRECTION",
  setQueryString: "SET_QUERY_STRING",
};

const initialState = {
  todoList: [],
  isLoading: false,
  errorMessage: "",
  isSaving: false,
  sortField: "createdTime",
  sortDirection: "desc",
  queryString: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.fetchTodos:
      return { ...state, isLoading: true, errorMessage: "" };

    case actions.loadTodos:
      const fetchedTodos = action.records.map((record) => ({
        id: record.id,
        ...record.fields,
        isCompleted: record.fields.isCompleted || false,
      }));
      return { ...state, todoList: fetchedTodos, isLoading: false };

    case actions.addTodo:
      const savedTodo = {
        id: action.record.id,
        ...action.record.fields,
        isCompleted: action.record.fields.isCompleted || false,
      };
      return {
        ...state,
        todoList: [...state.todoList, savedTodo],
        isSaving: false,
      };

    case actions.startRequest:
      return { ...state, isSaving: true, errorMessage: "" };

    case actions.endRequest:
      return { ...state, isSaving: false };

    case actions.setLoadError:
      return {
        ...state,
        errorMessage: action.error.message,
        isLoading: false,
        isSaving: false,
      };

    case actions.clearError:
      return { ...state, errorMessage: "" };

    case actions.setSortField:
      return { ...state, sortField: action.field };

    case actions.setSortDirection:
      return { ...state, sortDirection: action.direction };

    case actions.setQueryString:
      return { ...state, queryString: action.query };

    case actions.revertTodo:
      if (action.originalTodo) {
        return {
          ...state,
          todoList: state.todoList.map((todo) =>
            todo.id === action.originalTodo.id
              ? { ...action.originalTodo }
              : todo
          ),
        };
      } else if (action.originalTodos) {
        return {
          ...state,
          todoList: action.originalTodos,
        };
      }
      return state;

    case actions.updateTodo:
      const updatedTodoList = state.todoList.map((todo) =>
        todo.id === action.editedTodo.id ? { ...action.editedTodo } : todo
      );

      let newState = {
        ...state,
        todoList: updatedTodoList,
      };

      if (action.error) {
        newState.errorMessage = action.error.message;
      }
      return newState;

    case actions.completeTodo:
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          todo.id === action.id
            ? { ...todo, isCompleted: !todo.isCompleted }
            : todo
        ),
      };

    default:
      return state;
  }
};

export { actions, initialState, reducer };

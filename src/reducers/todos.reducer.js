export const actions = {
  //actions in useEffect that loads todos
  fetchTodos: "fetchTodos",
  loadTodos: "loadTodos",
  //found in useEffect and addTodo to handle failed requests
  setLoadError: "setLoadError",
  //actions found in addTodo
  startRequest: "startRequest",
  addTodo: "addTodo",
  endRequest: "endRequest",
  //found in helper functions
  updateTodo: "updateTodo",
  completeTodo: "completeTodo",
  //reverts todos when requests fail
  revertTodo: "revertTodo",
  //action on Dismiss Error button
  clearError: "clearError",
  // New actions for sort and query
  setSortField: "setSortField",
  setSortDirection: "setSortDirection",
  setQueryString: "setQueryString",
};

export const initialState = {
  todoList: [],
  isLoading: false,
  errorMessage: "",
  isSaving: false,
  sortField: "createdTime",
  sortDirection: "desc",
  queryString: "",
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    // useEffect (Pessimistic UI)
    case actions.fetchTodos:
      return {
        ...state,
        isLoading: true, // Set isLoading to true
      };
    case actions.loadTodos:
      // Move the logic that maps each record from records into a todo.
      // Update the ...records.map from the moved over code to use ...action.records.map
      const fetchedTodos = action.records.map((record) => ({
        id: record.id,
        ...record.fields,
        isCompleted: record.fields.isCompleted || false,
      }));
      return {
        ...state,
        todoList: fetchedTodos, // Set todoList property to the resulting mapped array
        isLoading: false, // Set isLoading state property back to false.
      };
    case actions.setLoadError:
      return {
        ...state,
        errorMessage: action.error.message, // set errorMessage to action.error.message
        isLoading: false, // set isLoading to false
      };

    // addTodo (Pessimistic UI)
    case actions.startRequest:
      return {
        ...state,
        isSaving: true, // set isSaving to true.
      };
    case actions.addTodo:
      // Move the logic that creates savedTodo and adds the isCompleted property when Airtable omits it from the record.
      const savedTodo = {
        id: action.record.id,
        ...action.record.fields,
        isCompleted: action.record.fields.isCompleted || false,
      };
      return {
        ...state,
        // Use a new array containing the destructured state.todoList and savedTodo to update the todoList property.
        todoList: [...state.todoList, savedTodo],
        isSaving: false, // Set isSaving to false
      };
    case actions.endRequest:
      return {
        ...state,
        isLoading: false, // update isLoading to false
        isSaving: false, // update isSaving to false
      };

    // updateTodo, completeTodo (Optimistic UI)
    case actions.updateTodo:
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          todo.id === action.todo.id ? { ...action.todo } : todo
        ),
      };
    case actions.completeTodo:
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          todo.id === action.id
            ? { ...todo, isCompleted: !todo.isCompleted }
            : todo
        ),
      };
    case actions.revertTodo:
      // This case handles reverting based on the payload (e.g., originalTodo for single, originalTodos for list)
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
      return state; // Fallback if neither originalTodo nor originalTodos is provided

    // Dismiss Error Button
    case actions.clearError:
      return {
        ...state,
        errorMessage: "", // set the errorMessage to an empty string.
      };

    // New cases for sort and query
    case actions.setSortField:
      return {
        ...state,
        sortField: action.field,
      };
    case actions.setSortDirection:
      return {
        ...state,
        sortDirection: action.direction,
      };
    case actions.setQueryString:
      return {
        ...state,
        queryString: action.query,
      };

    default:
      return state;
  }
};

// // src/reducers/todos.reducer.js

// export const actions = {
//   // actions in useEffect that loads todos
//   fetchTodos: "fetchTodos",
//   loadTodos: "loadTodos",
//   // found in useEffect and addTodo to handle failed requests
//   setLoadError: "setLoadError",
//   // actions found in addTodo
//   startRequest: "startRequest",
//   addTodo: "addTodo",
//   endRequest: "endRequest",
//   // found in helper functions
//   updateTodo: "updateTodo",
//   completeTodo: "completeTodo",
//   // reverts todos when requests fail
//   revertTodo: "revertTodo",
//   // action on Dismiss Error button
//   clearError: "clearError",
// };

// export const initialState = {
//   todoList: [],
//   isLoading: false,
//   errorMessage: "",
//   isSaving: false,
//   sortField: "createdTime",
//   sortDirection: "desc",
//   queryString: "",
// };

// export const reducer = (state = initialState, action) => {
//   switch (action.type) {
//     // useEffect (Pessimistic UI)
//     case actions.fetchTodos:
//       return {
//         ...state,
//         isLoading: true, // Set isLoading to true
//       };
//     case actions.loadTodos:
//       // Move the logic that maps each record from records into a todo.
//       // Update the ...records.map from the moved over code to use ...action.records.map
//       const fetchedTodos = action.records.map((record) => ({
//         id: record.id,
//         ...record.fields,
//         isCompleted: record.fields.isCompleted || false,
//       }));
//       return {
//         ...state,
//         todoList: fetchedTodos, // Set todoList property to the resulting mapped array
//         isLoading: false, // Set isLoading state property back to false.
//       };
//     case actions.setLoadError:
//       return {
//         ...state,
//         errorMessage: action.error.message, // set errorMessage to action.error.message
//         isLoading: false, // set isLoading to false
//       };

//     // addTodo (Pessimistic UI)
//     case actions.startRequest:
//       return {
//         ...state,
//         isSaving: true, // set isSaving to true.
//       };
//     case actions.addTodo:
//       // Move the logic that creates savedTodo and adds the isCompleted property when Airtable omits it from the record.
//       const savedTodo = {
//         id: action.record.id,
//         ...action.record.fields,
//         isCompleted: action.record.fields.isCompleted || false,
//       };
//       return {
//         ...state,
//         // Use a new array containing the destructured state.todoList and savedTodo to update the todoList property.
//         todoList: [...state.todoList, savedTodo],
//         isSaving: false, // Set isSaving to false
//       };
//     case actions.endRequest:
//       return {
//         ...state,
//         isLoading: false, // update isLoading to false
//         isSaving: false, // update isSaving to false
//       };

//     // updateTodo, completeTodo (Optimistic UI)
//     case actions.updateTodo:
//       return {
//         ...state,
//         todoList: state.todoList.map((todo) =>
//           todo.id === action.todo.id ? { ...action.todo } : todo
//         ),
//       };
//     case actions.completeTodo:
//       return {
//         ...state,
//         todoList: state.todoList.map((todo) =>
//           todo.id === action.id
//             ? { ...todo, isCompleted: !todo.isCompleted }
//             : todo
//         ),
//       };
//     case actions.revertTodo:
//       // This case handles reverting based on the payload (e.g., originalTodo for single, originalTodos for list)
//       if (action.originalTodo) {
//         return {
//           ...state,
//           todoList: state.todoList.map((todo) =>
//             todo.id === action.originalTodo.id
//               ? { ...action.originalTodo }
//               : todo
//           ),
//         };
//       } else if (action.originalTodos) {
//         return {
//           ...state,
//           todoList: action.originalTodos,
//         };
//       }
//       return state; // Fallback if neither originalTodo nor originalTodos is provided

//     // Dismiss Error Button
//     case actions.clearError:
//       return {
//         ...state,
//         errorMessage: "", // set the errorMessage to an empty string.
//       };

//     default:
//       return state;
//   }
// };

// export const actions = {
//   //actions in useEffect that loads todos
//   fetchTodos: "fetchTodos",
//   loadTodos: "loadTodos",
//   //found in useEffect and addTodo to handle failed requests
//   setLoadError: "setLoadError",
//   //actions found in addTodo
//   startRequest: "startRequest",
//   addTodo: "addTodo",
//   endRequest: "endRequest",
//   //found in helper functions
//   updateTodo: "updateTodo",
//   completeTodo: "completeTodo",
//   //reverts todos when requests fail
//   revertTodo: "revertTodo",
//   //action on Dismiss Error button
//   clearError: "clearError",
// };

// export const initialState = {
//   todoList: [],
//   isLoading: false,
//   errorMessage: "",
//   isSaving: false,
//   sortField: "createdTime",
//   sortDirection: "desc",
//   queryString: "",
// };

// export const reducer = (state = initialState, action) => {
//   switch (action.type) {
//     // useEffect (Pessimistic UI)
//     case actions.fetchTodos:
//       return {
//         ...state,
//         isLoading: true, // Set isLoading to true
//       };
//     case actions.loadTodos:
//       // Move the logic that maps each record from records into a todo.
//       // Update the ...records.map from the moved over code to use ...action.records.map
//       const fetchedTodos = action.records.map((record) => ({
//         id: record.id,
//         ...record.fields,
//         isCompleted: record.fields.isCompleted || false,
//       }));
//       return {
//         ...state,
//         todoList: fetchedTodos, // Set todoList property to the resulting mapped array
//         isLoading: false, // Set isLoading state property back to false.
//       };
//     case actions.setLoadError:
//       return {
//         ...state,
//         errorMessage: action.error.message, // set errorMessage to action.error.message
//         isLoading: false, // set isLoading to false
//       };

//     case actions.startRequest:
//       return {
//         ...state,
//         isSaving: true,
//       };
//     case actions.addTodo:

//       const savedTodo = {
//         id: action.record.id,
//         ...action.record.fields,
//         isCompleted: action.record.fields.isCompleted || false,
//       };
//       return {
//         ...state,

//         todoList: [...state.todoList, savedTodo],
//         isSaving: false,
//       };
//     case actions.endRequest:
//       return {
//         ...state,
//         isLoading: false,
//         isSaving: false,
//       };

//     case actions.updateTodo:
//       return {
//         ...state,
//         todoList: state.todoList.map((todo) =>
//           todo.id === action.todo.id ? { ...action.todo } : todo
//         ),
//       };
//     case actions.completeTodo:
//       return {
//         ...state,
//         todoList: state.todoList.map((todo) =>
//           todo.id === action.id
//             ? { ...todo, isCompleted: !todo.isCompleted }
//             : todo
//         ),
//       };
//     case actions.revertTodo:

//       if (action.originalTodo) {

//         return {
//           ...state,
//           todoList: state.todoList.map((todo) =>
//             todo.id === action.originalTodo.id
//               ? { ...action.originalTodo }
//               : todo
//           ),
//         };
//       } else if (action.originalTodos) {

//         return {
//           ...state,
//           todoList: action.originalTodos,
//         };
//       }
//       return state;

//         case actions.clearError:
//       return {
//         ...state,
//         errorMessage: "",
//       };

//     default:
//       return state;
//   }
// };

// // src/reducers/todos.reducer.js

// export const actions = {
//   //actions in useEffect that loads todos
//   fetchTodos: "fetchTodos",
//   loadTodos: "loadTodos",
//   //found in useEffect and addTodo to handle failed requests
//   setLoadError: "setLoadError",
//   //actions found in addTodo
//   startRequest: "startRequest",
//   addTodo: "addTodo",
//   endRequest: "endRequest",
//   //found in helper functions
//   updateTodo: "updateTodo",
//   completeTodo: "completeTodo",
//   //reverts todos when requests fail
//   revertTodo: "revertTodo",
//   //action on Dismiss Error button
//   clearError: "clearError",
// };

// export const initialState = {
//   todoList: [],
//   isLoading: false,
//   errorMessage: "",
//   isSaving: false,
//   sortField: "createdTime",
//   sortDirection: "desc",
//   queryString: "",
// };

// export const reducer = (state = initialState, action) => {
//   switch (action.type) {
//     case actions.fetchTodos:
//       return {
//         ...state,
//       };
//     case actions.loadTodos:
//       return {
//         ...state,
//       };
//     case actions.setLoadError:
//       return {
//         ...state,
//       };
//     case actions.startRequest:
//       return {
//         ...state,
//       };
//     case actions.addTodo:
//       return {
//         ...state,
//       };
//     case actions.endRequest:
//       return {
//         ...state,
//       };
//     case actions.updateTodo:
//       return {
//         ...state,
//       };
//     case actions.completeTodo:
//       return {
//         ...state,
//       };
//     case actions.revertTodo:
//       return {
//         ...state,
//       };
//     case actions.clearError:
//       return {
//         ...state,
//       };
//     default:
//       return state;
//   }
// };

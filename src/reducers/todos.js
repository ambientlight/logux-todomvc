import {
  ADD_TODO,
  DELETE_TODO,
  EDIT_TODO,
  COMPLETE_TODO,
  COMPLETE_ALL_TODOS,
  CLEAR_COMPLETED,
  SIGN_OUT,
  SIGN_IN_SUCCESS,
  SIGN_UP_SUCCESS
} from '../constants/ActionTypes'

const initialState = []

export default function todos(state = initialState, action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          ts: action.ts,
          completed: action.completed || false,
          text: action.text
        }
      ]

    case DELETE_TODO:
      return state.filter(todo =>
        todo.ts !== action.ts
      )

    case EDIT_TODO:
      return state.map(todo =>
        todo.ts === action.ts ?
          { ...todo, text: action.text } :
          todo
      )

    case COMPLETE_TODO:
      return state.map(todo =>
        todo.ts === action.ts ?
          { ...todo, completed: !todo.completed } :
          todo
      )

    case COMPLETE_ALL_TODOS:
      const areAllMarked = state.every(todo => todo.completed)
      return state.map(todo => ({
        ...todo,
        completed: !areAllMarked
      }))

    case CLEAR_COMPLETED:
      return state.filter(todo => todo.completed === false)

    // hacky: just drop todos when user changes. 
    // use LOAD_TODOS to load new user todos from the server
    case SIGN_IN_SUCCESS:
    case SIGN_UP_SUCCESS:
    case SIGN_OUT:
      return []
    default:
      return state
  }
}

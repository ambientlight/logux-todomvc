import * as types from '../constants/ActionTypes'

export const addTodo = text => ({ type: types.ADD_TODO, text })
export const deleteTodo = id => ({ type: types.DELETE_TODO, id })
export const editTodo = (id, text) => ({ type: types.EDIT_TODO, id, text })
export const completeTodo = id => ({ type: types.COMPLETE_TODO, id })
export const completeAllTodos = () => ({ type: types.COMPLETE_ALL_TODOS })
export const clearCompleted = () => ({ type: types.CLEAR_COMPLETED })
export const setVisibilityFilter = filter => ({ type: types.SET_VISIBILITY_FILTER, filter})

export const signUp = (username, password) => ({ type: types.SIGN_UP, username, password })
export const signIn = (username, password) => ({ type: types.SIGN_IN, username, password })

export const restoreUser = (username) => ({ type: types.RESTORE_USER, username })
export const loadTodos = () => ({ type: types.LOAD_TODOS })
export const signOut = () => ({ type: types.SIGN_OUT })
import { combineReducers } from 'redux'
import todos from './todos'
import visibilityFilter from './visibilityFilter'
import user from './user'

const rootReducer = combineReducers({
  todos,
  visibilityFilter,
  user
})

export default rootReducer

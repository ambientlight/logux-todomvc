import { SIGN_IN, SIGN_UP, RESTORE_USER, SIGN_OUT } from '../constants/ActionTypes'

const user = (state = null, action) => {
  switch(action.type){
    case SIGN_IN:
    case SIGN_UP:
    case RESTORE_USER:
      return action.username
    case SIGN_OUT:
      return null
    default:
      return state
  }
}

export default user
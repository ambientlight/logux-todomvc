import { connect } from 'react-redux'
import Header from '../components/Header'
import { addTodo } from '../actions'

const mapDispatchToProps = (dispatch, props) => ({
  addTodo: (text) => {
    dispatch.sync(addTodo(text))
  }
})

export default connect(null, mapDispatchToProps)(Header)

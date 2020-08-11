import { connect } from 'react-redux'
import Header from '../components/Header'
import { addTodo } from '../actions'

const mapDispatchToProps = (dispatch, props) => ({
  addTodo: (text, ts) => {
    dispatch.sync(addTodo(text, ts))
  }
})

export default connect(null, mapDispatchToProps)(Header)

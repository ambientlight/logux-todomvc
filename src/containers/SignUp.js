import { connect } from 'react-redux'
import SignUp from '../components/SignUp'
import { signUp } from '../actions'

const mapDispatchToProps = (dispatch, props) => ({
    signUp: (username, password) => {
        dispatch.sync(signUp(username, password))
    }
})

export default connect(null, mapDispatchToProps)(SignUp)
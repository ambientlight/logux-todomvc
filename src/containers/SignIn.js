import { connect } from 'react-redux'
import SignIn from '../components/SignIn'
import { signIn } from '../actions'

const mapDispatchToProps = (dispatch, props) => ({
    signUp: (username, password) => {
        dispatch.sync(signIn(username, password))
    }
})

export default connect(null, mapDispatchToProps)(SignIn)
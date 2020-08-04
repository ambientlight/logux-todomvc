import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import CredsInput from './CredsInput'

export default class SignUp extends Component {
  static propTypes = {
    signUp: PropTypes.func.isRequired
  }
  
  state = {
    allowed: false
  }

  render(){
    return (
      <div>
        <header className="header">
          <h1>sign up</h1>
        </header>
    
        <CredsInput 
          onChange={state => 
            this.setState({ allowed: state.username.length > 0 && state.password.length > 0 })
          }
          onCompletion={state => this.props.signUp(state.username, state.password)}
        />
        
        <footer className="footer">
          <div className="filters">
            <button
              disabled={this.state.allowed}
              className={this.state.allowed ? 'clear-completed' : ''}
              style={{
                  color: this.state.allowed ? 'inherit' : 'lightgrey',
                  float: 'left', 
                  marginLeft: '18px'
              }}
              onClick={() => console.log("should signup")}>
              sign up
            </button>
          </div>
    
          <Route path="/" render={props => 
            <button
              className="clear-completed"
              onClick={() => props.history.push('/signin')}>
                sign in instead
            </button>
          }></Route>
        </footer>
    
      </div>
    )
  }
}


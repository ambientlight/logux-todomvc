import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import CredsInput from './CredsInput'

export default class SignIn extends Component {
  static propTypes = {
    signUp: PropTypes.func.isRequired
  }
  
  state = {
    creds: { username: '', password: '' }
  }

  allowed(){
    return this.state.creds.username.length > 0 && this.state.creds.password.length > 0
  }

  render(){
    return (
      <div>
        <header className="header">
          <h1>sign in</h1>
        </header>
    
        <CredsInput 
          onChange={state => this.setState({ creds: state })}
          onCompletion={state => this.props.signUp(state.username, state.password)}
        />
        
        <footer className="footer">
          <div className="filters">
            <button
              disabled={!this.allowed()}
              className={this.allowed() ? 'clear-completed' : ''}
              style={{
                  color: this.allowed() ? 'inherit' : 'lightgrey',
                  float: 'left', 
                  marginLeft: '18px'
              }}
              onClick={() => this.props.signUp(this.state.creds.username, this.state.creds.password)}>
              sign in
            </button>
          </div>
    
          <Route path="/" render={props => 
            <button
              className="clear-completed"
              onClick={() => props.history.push('/signup')}>
                sign up instead
            </button>
          }></Route>
        </footer>
    
      </div>
    )
  }
}


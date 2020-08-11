import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'

export default class CredsInput extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onCompletion: PropTypes.func.isRequired
  }

  usernameInput = createRef()
  passwordInput = createRef()

  state = {
    username: '',
    password: ''
  }

  handleUsernameChange = e => {
    const newState = { ...this.state, username: e.target.value } 
    this.setState(newState)
    this.props.onChange(newState)
  }

  handlePasswordChange = e => {
    const newState = { ...this.state, password: e.target.value }
    this.setState(newState)
    this.props.onChange(newState)
  }

  handleUsernameKeyDown = e => {
    if(e.key === 'Enter' && this.state.username.length > 0 && this.passwordInput.current !== null){
      this.passwordInput.current.focus()
    }
  }

  handlePasswordKeyDown = e => {
    if(e.key === 'Enter' && this.state.username.length > 0 && this.state.password.length > 0){
      this.passwordInput.current.blur()
      this.props.onCompletion(this.state)
    }
  }

  render(){
    return (
      <>
        <input className='edit new-todo'
          ref={this.usernameInput}
          type="text"
          placeholder="email"
          autoFocus={true}
          value={this.state.username}
          onChange={this.handleUsernameChange}
          onKeyDown={this.handleUsernameKeyDown}
        />
        
        <input className='edit new-todo'
          ref={this.passwordInput}
          type="text"
          placeholder="password"
          autoFocus={false}
          value={this.state.password}
          onChange={this.handlePasswordChange}
          onKeyDown={this.handlePasswordKeyDown}
        />
      </>
    )
  }
}
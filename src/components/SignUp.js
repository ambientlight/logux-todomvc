import React from 'react'
import classnames from 'classnames'
import { Route } from 'react-router-dom'

const SignUp = () => (
<div>
  <header className="header">
    <h1>sign up</h1>
  </header>

  <input className={
    classnames({
      edit: true,
      'new-todo': true
    })}
    type="text"
    placeholder="username"
    autoFocus={true}
    /*
    value={this.state.text}
    onBlur={this.handleBlur}
    onChange={this.handleChange}
    onKeyDown={this.handleSubmit}
    */ 
  />
  
  <input className={
    classnames({
      edit: true,
      'new-todo': true
    })}
    type="text"
    placeholder="password"
    autoFocus={true}
    /*
    value={this.state.text}
    onBlur={this.handleBlur}
    onChange={this.handleChange}
    onKeyDown={this.handleSubmit}
    */
  />

  <footer className="footer">
    <div className="filters">
      <button
        className="clear-completed"
        style={{
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

export default SignUp

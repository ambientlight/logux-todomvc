import React from 'react'
import { render } from 'react-dom'
// import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './components/App'
import SignUp from './containers/SignUp'
import SignIn from './containers/SignIn'
import reducer from './reducers'
import 'todomvc-app-css/index.css'
import { createLoguxCreator } from '@logux/redux'
import { badge, badgeEn, log } from '@logux/client';
import { badgeStyles } from '@logux/client/badge/styles';
import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { SIGN_UP_SUCCESS, SIGN_IN_SUCCESS, SIGN_UP_ERROR, SIGN_IN_ERROR, SIGN_OUT } from './constants/ActionTypes'
import { restoreUser, loadTodos } from './actions/index'

const ANONYMOUS = '__anonymous__';

const tokenExpiration = localStorage.getItem('tokenExpiration');
const isTokenValid = (tokenExpiration && !isNaN(parseInt(tokenExpiration)) && parseInt(tokenExpiration) > Date.now())
const userId = localStorage.getItem('userId')

const createStore = createLoguxCreator({
  subprotocol: '1.0.0',
  server: process.env.NODE_ENV === 'development'
    ? 'ws://localhost:31337'
    : 'wss://logux.example.com',
  // do not use the token if 
  userId: isTokenValid && userId ? userId : ANONYMOUS,
  token: isTokenValid ? localStorage.getItem('token') : null,
});

const store = createStore(reducer, composeWithDevTools(applyMiddleware( thunkMiddleware )));
badge(store.client, { messages: badgeEn, styles: badgeStyles });
log(store.client);
store.client.start();

store.client.on('preadd', action => console.info(action))
// subscription example
// store.dispatch.sync({ type: 'logux/subscribe', channel: 'TEST' })

if(isTokenValid && userId){
  console.info(`Client assumed user: ${userId}`);
  store.dispatch(restoreUser(userId))
  store.dispatch.sync(loadTodos())
}

// auth logic
store.log.on('add', async action => {
  switch(action.type){
  case SIGN_UP_SUCCESS:
  case SIGN_IN_SUCCESS:
    // user username for userid since jwt token encodes it rather then sub and we will need for server-side jwt verification
    localStorage.setItem('userId', action.username)
    localStorage.setItem('token', action.authResult.AccessToken)
    localStorage.setItem('tokenExpiration', Date.now() + action.authResult.ExpiresIn * 1000)

    store.client.changeUser(action.username, action.authResult.AccessToken);
    await store.client.node.waitFor('synchronized');
    console.info(`Client assumed user: ${action.username}`);
    window.location.href = '/';
    break;
  case SIGN_OUT:
    localStorage.removeItem('userId')
    localStorage.removeItem('token')
    localStorage.removeItem('tokenExpiration')
    store.client.changeUser(ANONYMOUS, '');
    break
  case SIGN_UP_ERROR:
  case SIGN_IN_ERROR:
    alert(action.error.message)
    break;
  default:
    break
  }
})

render(
  <Provider store={store}>
    <Router>
      <Route exact path="/signup" component={SignUp} />
      <Route exact path="/signin" component={SignIn} />
      <Route exact path={["/", "/todos"]} component={App} />
    </Router>
  </Provider>,
  document.getElementById('root')
)

import React from 'react'
import { render } from 'react-dom'
// import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './components/App'
import SignUp from './components/SignUp'
import reducer from './reducers'
import 'todomvc-app-css/index.css'
import { createLoguxCreator } from '@logux/redux'
import { badge, badgeEn, log } from '@logux/client';
import { badgeStyles } from '@logux/client/badge/styles';
import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

const createStore = createLoguxCreator({
  subprotocol: '1.0.0',
  server: process.env.NODE_ENV === 'development'
    ? 'ws://localhost:31337'
    : 'wss://logux.example.com',
  userId: 'todo',
  token: ''
});

const store = createStore(reducer, composeWithDevTools(applyMiddleware( thunkMiddleware )));
badge(store.client, { messages: badgeEn, styles: badgeStyles });
log(store.client);
store.client.start();

store.client.on('preadd', action => console.log(action))
// subscription example
store.dispatch.sync({ type: 'logux/subscribe', channel: 'TEST' })

render(
  <Provider store={store}>
    <Router>
      <Route exact path="/signup" component={SignUp} />
      <Route exact path={["/", "/todos"]} component={App} />
    </Router>
  </Provider>,
  document.getElementById('root')
)

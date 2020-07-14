import React from 'react'
import { render } from 'react-dom'
// import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './components/App'
import reducer from './reducers'
import 'todomvc-app-css/index.css'
import { createLoguxCreator } from '@logux/redux'
import { badge, badgeEn, log } from '@logux/client';
import { badgeStyles } from '@logux/client/badge/styles';
import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'


const createStore = createLoguxCreator({
  subprotocol: '1.0.0',
  server: process.env.NODE_ENV === 'development'
    ? 'ws://localhost:31337'
    : 'wss://logux.example.com',
  userId: 'todo',  // TODO: We will fill it in next chapter
  token: '' // TODO: We will fill it in next chapter
});

const store = createStore(reducer, composeWithDevTools(applyMiddleware( thunkMiddleware )));
badge(store.client, { messages: badgeEn, styles: badgeStyles });
log(store.client);
store.client.start();

// subscription example
// FIXME: investigate resendResolve is not a function in proxy mode
/*
store.client.on('preadd', action => console.log(action))
store.client.log.add(
  { type: 'logux/subscribe', channel: 'GLOBAL_TEST' }, 
  { sync: true }
)
*/

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)


import { Server } from '@logux/server'
import * as path from 'path';
import { ChannelContext } from '@logux/server/context';
require('dotenv').config({ path: path.resolve(__dirname, '.env')})

import { signUpAndSignIn, signIn } from './auth'
import { verifyToken } from './verify_jvt'
import { Todo } from './dynamodb' 

const server = new Server(
  Server.loadOptions(process, {
    subprotocol: '1.0.0',
    supports: '1.x',
    root: __dirname
  })
)

server.auth(async auth => {
  // Allow only local users until we will have a proper authentication
  if(auth.userId === '__anonymous__'){
    // allow anonymous auth
    return true
  } else {
    const claimVerifyResult = await verifyToken(auth.token)
    return claimVerifyResult.userName == auth.userId
  }
})

server.type<{type: 'SIGN_UP', username: string, password: string}>('SIGN_UP', {
  access: (ctx, action, meta) => true,
  process: signUpAndSignIn
})

server.type<{type: 'SIGN_IN', username: string, password: string}>('SIGN_IN', {
  access: (ctx, action, meta) => true,
  process: signIn
})

server.type<{type: 'ADD_TODO', text: string}>('ADD_TODO', {
  access: (ctx, action, meta) => true,
  process: async (ctx, action, meta) => {
    if(ctx.userId === '__anonymous__'){ return }

    const todo = new Todo({
      userId: ctx.userId, 
      ts: Date.now(), 
      text: action.text,
      completed: false
    })

    try {
      await todo.save();
      console.info("Save operation was successful.");
    } catch (error) {
      console.error(error);
    }
  }
})

/*
server.type(/^\w*TODO|SET_VISIBILITY_FILTER$/, {
  access (ctx, action, meta) {
    return true
  },
  resend (ctx, action, meta) {
    // Resend this action to everyone who subscribed to this user
    return { channel: `TEST` }
  },
  process (ctx, action, meta) {},
  finally (ctx, action, meta) {}
})
*/

/*
server.channel('TEST', {
  async access (ctx, action, meta) {
    return true
  },
  async load (ctx, action, meta) {
    return { type: 'ADD_TODO', text: 'Hello from Logux' }
  }
})
*/

server.otherType({
  access: (ctx, action, meta) => true,
  process: (ctx, action, meta) => {
    // do some processing for all expicitly unhandled action
    console.error("Unhandle actions")
    console.error(action)
  },
  finally: (ctx, action, meta) => {
    // finalization logic for all explictly unhandled actions
  }
})

server.listen()
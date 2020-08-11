
import { Server } from '@logux/server'
import * as path from 'path';
import { ChannelContext } from '@logux/server/context';
require('dotenv').config({ path: path.resolve(__dirname, '.env')})

import { signUpAndSignIn, signIn } from './auth'
import { verifyToken } from './verify_jvt'
import { Todo } from './dynamodb' 

const ANONYMOUS = '__anonymous__';

const server = new Server(
  Server.loadOptions(process, {
    subprotocol: '1.0.0',
    supports: '1.x',
    root: __dirname
  })
)

server.auth(async auth => {
  // Allow only local users until we will have a proper authentication
  if(auth.userId === ANONYMOUS){
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

server.type<{type: 'ADD_TODO', text: string, ts: number, completed?: boolean}>('ADD_TODO', {
  access: (ctx, action, meta) => true,
  process: async (ctx, action, meta) => {
    if(ctx.userId === ANONYMOUS){ return }

    const todo = new Todo({
      userId: ctx.userId, 
      ts: action.ts, 
      text: action.text,
      completed: action.completed || false
    })

    try {
      await todo.save();
    } catch (error) {
      console.error(error);
    }
  }
})

server.type<{type: 'DELETE_TODO', ts: number}>('DELETE_TODO', {
  access: (ctx, action, meta) => true,
  process: async (ctx, action, meta) => {
    if(ctx.userId === ANONYMOUS){ return }

    (Todo as any).delete({ userId: ctx.userId, ts: action.ts })
  }
})

server.type<{type: 'EDIT_TODO', ts: number, text: string}>("EDIT_TODO", {
  access: (ctx, action, meta) => true,
  process: async (ctx, action, meta) => {
    if(ctx.userId === ANONYMOUS){ return }

    Todo.update({ userId: ctx.userId, ts: action.ts, text: action.text })
  }  
})

server.type<{type: 'COMPLETE_TODO', ts: number, text: string}>("COMPLETE_TODO", {
  access: (ctx, action, meta) => true,
  process: async (ctx, action, meta) => {
    if(ctx.userId === ANONYMOUS){ return }

    const todo = await (Todo as any).get({ userId: ctx.userId, ts: action.ts })
    todo.completed = !todo.completed
    await todo.save()
  }
})

server.type<{type: 'LOAD_TODOS'}>('LOAD_TODOS', {
  access: (ctx, action, meta) => ctx.userId !== ANONYMOUS,
  process: async (ctx, action, meta) => {
    if(ctx.userId === ANONYMOUS){ return }

    const res = await (Todo.query("userId").eq(ctx.userId) as any).exec()
    for (let todo of res){
      ctx.sendBack({ 
        type: 'ADD_TODO', 
        text: todo.text, 
        ts: todo.ts, 
        completed: todo.completed
      })
    }
  }
})

server.otherType({
  access: (ctx, action, meta) => true,
  process: (ctx, action, meta) => {
    // some processing for all expicitly unhandled action
    console.error("Unhandle actions")
    console.error(action)
  },
  finally: (ctx, action, meta) => {
  }
})

server.listen()
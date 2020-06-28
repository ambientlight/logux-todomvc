
import { Server } from '@logux/server'
import * as path from 'path';
import { ChannelContext } from '@logux/server/context';
require('dotenv').config({ path: path.resolve(__dirname, '.env')})

const server = new Server(
  Server.loadOptions(process, {
    subprotocol: '1.0.0',
    supports: '1.x',
    root: __dirname
  })
)

server.auth(({ userId, token }) => {
  // Allow only local users until we will have a proper authentication
  return process.env.NODE_ENV === 'development'
})

server.channel('GLOBAL_TEST', {
  access (ctx: ChannelContext<{}, { id: string }, {}>) {
    return true
  },
  async load (ctx) {
    // let name = await db.loadUserName(ctx.params.id)
    // Creating action to set user name and sending it to subscriber
    return { type: 'ADD_TODO', name: "TEST TEST TEST" }
  }
})

server.type('ADD_TODO', {
  access (ctx, action, meta) {
    return true
  },
  resend (ctx, action, meta) {
    // Resend this action to everyone who subscribed to this user
    return { channel: `GLOBAL_TEST` }
  },
  process (ctx, action, meta) {
    console.log(`PROCESS ADD_TODO`)
  },
  finally (ctx, action, meta) {
    console.log(`FINALLY ADD_TODO`)
  }
})

server.otherType({
  access (ctx, action, meta) {
    return true
  },
  resend (ctx, action, meta) {
    // Resend this action to everyone who subscribed to this channel
    return { channel: `GLOBAL_TEST` }
  },
  process (ctx, action, meta) {
    // do some processing for all expicitly unhandled action
  },
  finally (ctx, action, meta) {
    // finalization logic for all explictly unhandled actions
  }
})

server.listen()
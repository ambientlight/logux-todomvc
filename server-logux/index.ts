
import { Server } from '@logux/server'
import * as path from 'path';
import { ChannelContext } from '@logux/server/context';
require('dotenv').config({ path: path.resolve(__dirname, '.env')})
import * as AWS from 'aws-sdk'

const cognito = new AWS.CognitoIdentityServiceProvider()

const server = new Server(
  Server.loadOptions(process, {
    subprotocol: '1.0.0',
    supports: '1.x',
    root: __dirname
  })
)

server.auth(auth => {
  // Allow only local users until we will have a proper authentication
  return process.env.NODE_ENV === 'development'
})

server.type(/^\w*TODO|SET_VISIBILITY_FILTER$/, {
  access (ctx, action, meta) {
    return true
  },
  /*
  resend (ctx, action, meta) {
    // Resend this action to everyone who subscribed to this user
    return { channel: `TEST` }
  },
  */
  process (ctx, action, meta) {

  },
  finally (ctx, action, meta) {

  }
})

server.type<{type: 'SIGN_UP', username: string, password: string}>('SIGN_UP', {
  access: (ctx, action, meta) => true,
  async process(ctx, action, meta) {
    const signUpResult = await cognito.signUp({
      ClientId: process.env.USERPOOL_CLIENT_ID as string,
      Password: action.password,
      Username: action.username
    }).promise()

    if(!signUpResult.UserConfirmed && signUpResult.$response.error === null){
      const confirmResult = await cognito.adminConfirmSignUp({
        UserPoolId: process.env.USERPOOL_ID as string,
        Username: action.username
      }).promise()

      if(confirmResult.$response.error !== null){
        // confirmation error
      } {
        // TODO: user confirmed, pass back credentials to the client
      }
      console.log(confirmResult.$response.error)
      console.log(confirmResult.$response.data)
    } else {
      // TODO: propagate error back to client as action??? 
    }
  }
})

server.channel('TEST', {
  async access (ctx, action, meta) {
    return true
  },
  async load (ctx, action, meta) {
    return { type: 'ADD_TODO', text: 'Hello from Logux' }
  }
})

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
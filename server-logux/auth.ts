import { Context, ServerMeta } from '@logux/server'
import * as AWS from 'aws-sdk'
import { SignUpResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';

const cognito = new AWS.CognitoIdentityServiceProvider()

export const signIn = async (
  ctx: Context,
  action: {type: 'SIGN_IN', username: string, password: string},
  meta: ServerMeta
) => {
  let authResult;
  try {
    authResult = await cognito.adminInitiateAuth({
      ClientId: process.env.USERPOOL_CLIENT_ID as string,
      UserPoolId: process.env.USERPOOL_ID as string,
      AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
      AuthParameters: {
        USERNAME: action.username,
        PASSWORD: action.password
      }
    }).promise()
  } catch(error){
    console.error(error)
    ctx.sendBack({
      type: "SIGN_IN_ERROR",
      username: action.username,
      error
    })
    return
  }

  ctx.sendBack({ 
    type: "SIGN_IN_SUCCESS",
    username: action.username,
    authResult: authResult.AuthenticationResult
  })
}

export const signUpAndSignIn = async (
  ctx: Context,
  action: {type: 'SIGN_UP', username: string, password: string},
  meta: ServerMeta
) => {
  let signUpResult;
  try {
    signUpResult = await cognito.signUp({
      ClientId: process.env.USERPOOL_CLIENT_ID as string,
      Password: action.password,
      Username: action.username
    }).promise()
  } catch (error) {
    console.error(error)
    ctx.sendBack({
      type: "SIGN_UP_ERROR",
      username: action.username,
      error
    })
    return
  }

  let confirmResult;
  try {
    confirmResult = await cognito.adminConfirmSignUp({
      UserPoolId: process.env.USERPOOL_ID as string,
      Username: action.username
    }).promise()
    // user confirmed
  } catch(error){
    console.error(error)
    // no need to handle confirmation error for now
  }
  
  let authResult;
  try {
    authResult = await cognito.adminInitiateAuth({
      ClientId: process.env.USERPOOL_CLIENT_ID as string,
      UserPoolId: process.env.USERPOOL_ID as string,
      AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
      AuthParameters: {
        USERNAME: action.username,
        PASSWORD: action.password
      }
    }).promise()
  } catch(error){
    console.error(error)
    ctx.sendBack({
      type: "SIGN_UP_ERROR",
      username: action.username,
      error
    })
    return
  }

  // pass back credentials to the client
  ctx.sendBack({ 
    type: "SIGN_UP_SUCCESS",
    username: action.username,
    userId: (signUpResult.$response.data as SignUpResponse).UserSub,
    authResult: authResult.AuthenticationResult
  })
}
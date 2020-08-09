# Logux TodoMVC Example
Example project to explore and demonstate how Logux client-server stack may look like when built it around conventional `react/redux` app.
For this reason `TodoMVC` from [Getting Start with Redux](https://egghead.io/courses/getting-started-with-redux) and [reduxjs/examples/todomvc](https://github.com/reduxjs/redux/tree/master/examples/todomvc) was taken. For now it doesn't do much, createStore and dispatch from original `todomvc` have been patched so that dispatch actions will be synced with other tabs and server. Server side logic is at [server-logix](/server-logux) 

This project template was built with [Create React App](https://github.com/facebookincubator/create-react-app), which provides a simple way to start React projects with no build configuration needed.

## Installation

From the first terminal tab:
```shell
yarn install
yarn start
```

For the server side, make sure you have `jq` and `awscli` available at path and configured with your credentials. Then in another terminal tab run:

```shell
# create AWS-powered backend stack via CloudFormation
aws cloudformation deploy --template cf/cognito.yaml --stack-name todoapp-cognito
# define AWS_REGION, USERPOOL_ID, USERPOOL_CLIENT_ID for cognito
export AWS_REGION=eu-central-1
export USERPOOL_ID=$(aws cloudformation describe-stacks --stack-name todoapp-cognito | jq -r '.Stacks[0].Outputs | .[] | select(.OutputKey=="UserPoolId").OutputValue')
export USERPOOL_CLIENT_ID=$(aws cloudformation describe-stacks --stack-name todoapp-cognito | jq -r '.Stacks[0].Outputs | .[] | select(.OutputKey=="UserPoolClientId").OutputValue')

# get JSON Web Key Set for JWT token verification
curl https://cognito-idp.$AWS_REGION.amazonaws.com/$USERPOOL_ID/.well-known/jwks.json > server-logux/jwks.json

# generate .env
echo $AWS_REGION > server-logux/.env
echo $USERPOOL_ID >> server-logux/.env
echo $USERPOOL_CLIENT_ID >> server-logux/.env
```

Then to install dependencies and start the server run:

```
cd server-logux
yarn install
yarn start
```

## TODOs

- [ ] 1. DynamoDB backend on server-side
- [ ] 2. Cloudformation deployment to AWS
- [X] 3. Integrate authentification with Congito
- [ ] 4. Rewrite with hooks in designated brunch
- [ ] 5. Integrate `redux-crdt` once completed.
- [ ] 6. [Server-less cloud](https://github.com/logux/logux/issues/6) after `logux-server/logux-client` can work via HTTP.

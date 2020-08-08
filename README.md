# Logux TodoMVC Example
Example project to explore and demonstate how Logux client-server stack may look like when built it around conventional `react/redux` app.
For this reason `TodoMVC` from [Getting Start with Redux](https://egghead.io/courses/getting-started-with-redux) and [reduxjs/examples/todomvc](https://github.com/reduxjs/redux/tree/master/examples/todomvc) was taken. For now it doesn't do much, createStore and dispatch from original `todomvc` have been patched so that dispatch actions will be synced with other tabs and server. Server side logic is at [server-logix](/server-logux) 

This project template was built with [Create React App](https://github.com/facebookincubator/create-react-app), which provides a simple way to start React projects with no build configuration needed.

Projects built with Create-React-App include support for ES6 syntax, as well as several unofficial / not-yet-final forms of Javascript syntax such as Class Properties and JSX. See the list of [language features and polyfills supported by Create-React-App](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#supported-language-features-and-polyfills) for more information.

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
# generate .env for AWS: set AWS_REGION, USERPOOL_ID, USERPOOL_CLIENT_ID for cognito
echo AWS_REGION=eu-central-1 > server-logux/.env
echo USERPOOL_ID=$(aws cloudformation describe-stacks --stack-name todoapp-cognito | jq -r '.Stacks[0].Outputs | .[] | select(.OutputKey=="UserPoolId").OutputValue') >> server-logux/.env
echo USERPOOL_CLIENT_ID=$(aws cloudformation describe-stacks --stack-name todoapp-cognito | jq -r '.Stacks[0].Outputs | .[] | select(.OutputKey=="UserPoolClientId").OutputValue') >> server-logux/.env
```

Then to install dependencies and start the server run:

```
cd server-logux
yarn install
yarn start
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## TODOs

- [ ] 1. DynamoDB backend on server-side
- [ ] 2. Cloudformation deployment to AWS
- [ ] 3. Integrate authentification with Congito
- [ ] 4. Rewrite with hooks in designated brunch
- [ ] 5. Integrate `redux-crdt` once completed.
- [ ] 6. [Server-less cloud](https://github.com/logux/logux/issues/6) after `logux-server/logux-client` can work via HTTP.
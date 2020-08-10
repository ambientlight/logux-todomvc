import * as dynamoose from "dynamoose";

dynamoose.aws.ddb.local("http://localhost:8000");

export const Todo = dynamoose.model(
  "Todo", 
  {
    // a combination of user-ts would uniquely identify the TODO
    userId: { type: String, hashKey: true },
    ts: { type: Number, rangeKey: true },
    text: String,
    completed: Boolean
  }
);
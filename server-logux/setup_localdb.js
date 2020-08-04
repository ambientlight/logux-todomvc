const AWS = require("aws-sdk");
AWS.config.update({
    region: 'eu-central-1',
    endpoint: process.env.DYNAMO_ENDPOINT || 'http://localhost:8000'
});

const dynamodb = new AWS.DynamoDB();
const params = {
    TableName: "Todos",
    KeySchema: [
        { AttributeName: "id", KeyType: "HASH" },
    ],
    AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "N" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(params, function (err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    }
    else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});

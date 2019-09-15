import AWS from "aws-sdk";

export function call(action, params) {
  const dynamoDb = new AWS.DynamoDB.DocumentClient({apiVersion: 'latest', region: 'ap-southeast-2'});

  return dynamoDb[action](params).promise();
}

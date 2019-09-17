import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const params = {
    TableName: process.env.tableName,
    Key: {
      id: event.pathParameters.id
    },
    UpdateExpression: "SET isRegistered = :isRegistered",
    ExpressionAttributeValues: {
      ":isRegistered": true,
    },
    ReturnValues: "ALL_NEW"
  };

  try {
      await dynamoDbLib.call("update", params);
      return success({ status: true });
  } catch (e) {
    return failure({ status: false, error: e, message: "Confirm registration failed" });
  }
}

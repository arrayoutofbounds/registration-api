import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Key: {
      id: event.pathParameters.id
    },
    UpdateExpression: "SET points = points - :decrement",
    ExpressionAttributeValues: {
      ":decrement": data.pointsRedeemed,
    },
    ReturnValues: "UPDATED_NEW"
  };

  try {
      await dynamoDbLib.call("update", params);
      return success({ status: true });
  } catch (e) {
    return failure({ status: false, error: e, message: `Reedeming ${data.pointsGiven} failed.` });
  }
}

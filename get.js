import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key and sort key of the item to be retrieved
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      id: event.pathParameters.id
    },
    ProjectionExpression: "id, firstName, lastName, fatherName, motherName, age, address, email, fatherMobile, motherMobile, isRegistered, points, timeSlot, emergencyContact, emergencyNumber"
  };

  try {
    const result = await dynamoDbLib.call("get", params);
    if (result.Item) {
      // Return the retrieved item
      return success(result.Item);
    } else {
      return failure({ status: false, error: "Item not found." });
    }
  } catch (e) {
    return failure({ status: false });
  }
}
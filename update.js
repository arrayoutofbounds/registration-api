import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'id': path parameter
    Key: {
      id: event.pathParameters.id
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: "SET firstName = :firstName, lastName = :lastName, fatherName = :fatherName, motherName = :motherName, address = :address, fatherMobile = :fatherMobile, motherMobile = :motherMobile, email = :email, age = :age, emergencyContact = :emergencyContact, emergencyNumber = :emergencyNumber",
    ExpressionAttributeValues: {
      ":firstName": data.firstName || null,
      ":lastName": data.lastName || null,
      ":fatherName": data.fatherName || null,
      ":motherName": data.motherName || null,
      ":address": data.address || null,
      ":fatherMobile": data.fatherMobile || null,
      ":motherMobile": data.motherMobile || null,
      ":email": data.email || null,
      ":age": data.age || null,
      ":emergencyContact": data.emergencyContact || null,
      ":emergencyNumber": data.emergencyNumber || null,
    },
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: "ALL_NEW"
  };

  try {
    await dynamoDbLib.call("update", params);
    return success({ status: true });
  } catch (e) {
    return failure({ status: false, error: e });
  }
}

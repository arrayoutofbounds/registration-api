import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";
import shortid from 'shortid';

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      id: shortid.generate(),
      firstName: data.firstName,
      lastName: data.lastName,
      fatherName: data.fatherName,
      motherName: data.motherName,
      address: data.address,
      fatherMobile: data.fatherMobile,
      motherMobile: data.motherMobile,
      isRegistered: false,
      activities: [],
      email: data.email,
      age: data.age,
      emergencyContact: data.emergencyContact,
      emergencyNumber: data.emergencyNumber,
      qr: data.qr,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    return failure({ status: false });
  }
}

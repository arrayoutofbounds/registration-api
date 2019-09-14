import * as dynamoDbLib from "./libs/dynamodb-lib";
import * as s3 from "./libs/s3-lib";
import { success, failure } from "./libs/response-lib";
import shortid from 'shortid';
import Qr from 'qrcode';
// import fs from 'fs';

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const id = shortid.generate();
  // const qrFileStream = QrCode.toFileStream(fs.createWriteStream(), [id, data.firstName, data.lastName, data.emergencyContact, data.emergencyNumber]);

  try{
    await s3.call("upload", {
      Bucket: process.env.bucketName,
      Key: `${id}.png`,
      Body: new Buffer(Qr.toDataURL([id, data.firstName, data.lastName]).replace(/^data:image\/\w+;base64,/, ""),'base64'),
      ContentEncoding: 'base64',
      ContentType: 'image/png'
    });
  } catch (e) {
    return failure({ status: false, message: e });
  }

  const params = {
    TableName: process.env.tableName,
    Item: {
      id,
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
      qr: `${id}.png`,
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

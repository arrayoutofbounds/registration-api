import * as dynamoDbLib from "./libs/dynamodb-lib";
import * as s3 from "./libs/s3-lib";
import { success, failure } from "./libs/response-lib";
import shortid from 'shortid';
import QRCode from 'qrcode';

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const id = shortid.generate();

  const opts = {
    errorCorrectionLevel: 'H',
    type: 'image/png',
  };

  const dataToEncode = {
    id,
    firstName: data.firstName,
    lastName: data.lastName,
    emergencyContact: data.emergencyContact,
    emergencyNumber: data.emergencyNumber
  };

  const dataUrl = await QRCode.toDataURL(JSON.stringify(dataToEncode), opts);
  const buffer = new Buffer(dataUrl.toString().replace(/^data:image\/\w+;base64,/, ""), 'base64');

  console.log("uploading to s3");

  // upload qr code to s3
  try{
    console.log(process.env.bucketName);
    await s3.call("upload", {
      Bucket: process.env.bucketName,
      Key: `${id}.png`,
      Body: buffer,
      ContentEncoding: 'base64',
      ContentType: 'image/png'
    });
  } catch (e) {
    console.log("upload to s3 failed");
    console.log(e);
    return failure({ status: false, message: e });
  }

  console.log("adding to table");

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
      activities: {},
      email: data.email,
      age: data.age,
      emergencyContact: data.emergencyContact,
      emergencyNumber: data.emergencyNumber,
      qr: `${id}.png`,
      timeSlot: data.timeSlot, // 1 or 2
      dataUrl,
      points: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  };

  // store into database
  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    console.log("adding to table failed");
    return failure({ status: 'failed inserting into database' });
  }
}
import * as dynamoDbLib from "./libs/dynamodb-lib";
import * as s3 from "./libs/s3-lib";
import { success, failure } from "./libs/response-lib";
import shortid from 'shortid';
import QRCode from 'qrcode';
import * as sesLib from './libs/ses-lib';

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const id = shortid.generate();
  // const qrFileStream = QrCode.toFileStream(fs.createWriteStream(), [id, data.firstName, data.lastName, data.emergencyContact, data.emergencyNumber]);

  const opts = {
    errorCorrectionLevel: 'H',
    type: 'image/png',
  };

  const dataUrl = await QRCode.toDataURL([id, data.firstName, data.lastName], opts);
  const buffer = new Buffer(dataUrl.toString().replace(/^data:image\/\w+;base64,/, ""), 'base64');

  // upload qr code to s3
  try{
    await s3.call("upload", {
      Bucket: process.env.bucketName,
      Key: `${id}.png`,
      Body: buffer,
      ContentEncoding: 'base64',
      ContentType: 'image/png'
    });
  } catch (e) {
    console.log(e);
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
      timeSlot: data.timeSlot,
      dataUrl,
      pointsAccumulated: 0,
      pointsRedeemed: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  };

  // store into database
  try {
    await dynamoDbLib.call("put", params);
  } catch (e) {
    return failure({ status: false });
  }

  // send an email using SES
  try{
    await sesLib.call(params.Item);
    return success(params.Item);
  } catch(e){
    return failure({ status: false });
  }
}

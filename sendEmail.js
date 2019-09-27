import { DynamoDB } from 'aws-sdk';
import * as sesLib from './libs/ses-lib';
import { success, failure } from "./libs/response-lib";

const converter = DynamoDB.Converter;

export async function main(event, context) {
    event.Records.forEach(async record => {
        if (record.eventName === 'INSERT') {
            const unMarshelledRecord = converter.unmarshall(record.dynamodb.NewImage);

            // send an email using SES
            try {
                console.log("sending email");
                await sesLib.call(unMarshelledRecord);
                return success(unMarshelledRecord);
            } catch (e) {
                console.log("sending email failed");
                return failure({ status: 'failed sending email', error: e });
            }
        }
    });
}
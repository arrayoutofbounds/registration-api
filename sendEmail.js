import { DynamoDB } from 'aws-sdk';
import * as sesLib from './libs/ses-lib';

const converter = DynamoDB.Converter;

export async function main(event, context) {
    console.log(event.Records);
    for(let i = 0; i < event.Records.length; i++){
        const record = event.Records[i];
        if (record.eventName === 'INSERT') {
            const unMarshelledRecord = converter.unmarshall(record.dynamodb.NewImage);

            console.log(unMarshelledRecord);
            // send an email using SES
            try {
                console.log("sending email");
                console.log(unMarshelledRecord);
                await sesLib.call(unMarshelledRecord);
            } catch (e) {
                console.log("sending email failed");
            }
        }
    }
    // for (let record in event.Records) {
    //     if (record.eventName === 'INSERT') {
    //         const unMarshelledRecord = converter.unmarshall(record.dynamodb.NewImage);

    //         console.log(unMarshelledRecord);
    //         // send an email using SES
    //         try {
    //             console.log("sending email");
    //             console.log(unMarshelledRecord);
    //             await sesLib.call(unMarshelledRecord);
    //         } catch (e) {
    //             console.log("sending email failed");
    //         }
    //     }
    // }
}
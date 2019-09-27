import { DynamoDB } from 'aws-sdk';

const converter = DynamoDB.Converter;

export async function main(event, context) {
    event.Records.forEach(record => {
        if(record.eventName === 'INSERT'){
            const unMarshelledRecord = converter.unmarshall(record.dynamodb.NewImage);
            console.log(unMarshelledRecord);
        }
    });
}
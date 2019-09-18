import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
    const params1 = {
        TableName: process.env.tableName,
        FilterExpression : 'timeSlot = :timeSlot',
        ExpressionAttributeValues : {':timeSlot' : 1}
    };

    const params2 = {
        TableName: process.env.tableName,
        FilterExpression : 'timeSlot = :timeSlot',
        ExpressionAttributeValues : {':timeSlot' : 2}
    };

    try {
        const result1 = await dynamoDbLib.call("scan", params1);
        const result2 = await dynamoDbLib.call("scan", params2);

        return success({
            slot1: result1.Count,
            slot2: result2.Count
        });
    } catch (e) {
        return failure({ status: false, error: "No items found." });
    }
}

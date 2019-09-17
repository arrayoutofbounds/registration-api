import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
    const params = {
        TableName: process.env.tableName,
        Key: {
            id: event.pathParameters.id
        },
        ProjectionExpression: "points"
    };

    try {
        const result = await dynamoDbLib.call("get", params);
        return success(result.Item);
    } catch (e) {
        return failure({ status: false, error: "Points not found." });
    }
}

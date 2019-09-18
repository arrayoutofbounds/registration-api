import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
    const activityAttended = event.pathParameters.activityId;

    const getItemParams = {
        TableName: process.env.tableName,
        Key: {
            id: event.pathParameters.id
        },
        ProjectionExpression: "activities"
    };

    try {
        const activityItems = await dynamoDbLib.call("get", getItemParams);
        if (activityItems.Item) {
            const activities = activityItems.Item.activities;
            const activityToUpdate = activities[activityAttended] || {
                attendedCount: 0
            };

            activityToUpdate.attendedCount += 1;

            const params = {
                TableName: process.env.tableName,
                Key: {
                    id: event.pathParameters.id
                },
                UpdateExpression: "SET #activities.#activity = :activity",
                ExpressionAttributeNames: {
                    "#activity": activityAttended.toString(),
                    "#activities": "activities",
                },
                ExpressionAttributeValues: {
                    ":activity": activityToUpdate,
                },
                ReturnValues: "UPDATED_NEW"
            };

            try {
                await dynamoDbLib.call("update", params);
                return success({ status: true });
            } catch (e) {
                return failure({ status: false, error: e, message: `Adding attendance to activity ${activityAttended} failed.` });
            }
        } else {
            return failure({ status: false, error: "Activities not found." });
        }
    } catch (e) {
        return failure({ status: false });
    }
}

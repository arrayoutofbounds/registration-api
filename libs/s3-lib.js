import AWS from "aws-sdk";

export function call(action, params) {
  const s3 = new AWS.S3({apiVersion: '2006-03-01', region: 'ap-southeast-2'});

  return s3[action](params).promise();
}

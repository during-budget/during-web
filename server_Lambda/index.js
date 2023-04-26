console.log("Loading function");

const aws = require("aws-sdk");
const strftime = require("strftime");
const strftimeKOR = strftime.timezone("+0900");
const date = strftimeKOR("%F", new Date());

exports.handler = async (event, context) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  // Get the object from the event and show its content type
  const accessKeyId = event.access_key_id;
  const secretAccessKey = event.secret_access_key;

  const s3 = new aws.S3({
    accessKeyId,
    secretAccessKey,
    region: "ap-northeast-2",
  });

  const bucket = event.bucket;

  try {
    const data = await s3
      .listObjectsV2({
        Bucket: bucket,
        Prefix: "raw",
      })
      .promise();

    for (let content of data.Contents) {
      const keys = content.Key.split("/");
      if (keys.length === 2 && keys[1] !== "") {
        await s3
          .copyObject({
            Bucket: bucket,
            CopySource: `${bucket}/${content.Key}`, // old file Key
            Key: `archived/${date}/${content.Key.replace("raw/", "")}`, // new file Key
          })
          .promise();

        await s3
          .deleteObject({
            Bucket: bucket,
            Key: content.Key,
          })
          .promise();
      }
    }

    return data;
  } catch (err) {
    console.log(err);
    const message = `Error getting object lists from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
    console.log(message);
    throw new Error(message);
  }
};

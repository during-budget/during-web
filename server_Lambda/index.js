console.log("Loading function");

const aws = require("aws-sdk");
const strftime = require("strftime");
const strftimeKOR = strftime.timezone("+0900");

// set date as yesterday
const _date = new Date();
_date.setDate(_date.getDate() - 1);
const date = strftimeKOR("%F", _date);

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
        const subKeys = keys[1].split(" ");
        if (subKeys.length === 3) {
          await s3
            .copyObject({
              Bucket: bucket,
              CopySource: `${bucket}/${content.Key}`, // old file Key
              Key: `archived/${date}/${date} ${subKeys[2]}`, // new file Key
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
    }

    return data;
  } catch (err) {
    console.log(err);
    const message = `Error getting object lists from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
    console.log(message);
    throw new Error(message);
  }
};

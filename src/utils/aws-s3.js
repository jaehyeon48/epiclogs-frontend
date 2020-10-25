import AWS from 'aws-sdk';
require('dotenv').config();


const ID = process.env.REACT_APP_AWS_ID;
const SECRET = process.env.REACT_APP_AWS_SECRET;

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
})

export async function uploadImageToS3(fileName, fileData) {
  const params = {
    Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
    Key: `post-images/${fileName}`,
    ContentEncoding: 'base64',
    Body: fileData
  };

  // s3.upload(params, (err, data) => {
  //   if (err) throw err;

  //   return new Promise((resolve) => resolve(data.location));
  //   // console.log('File uploaded successfully to the bucket!');
  // });

  const uploadRes = await s3.upload(params).promise();
  return uploadRes.Location;
}

export function deleteAvatarFromS3(fileName) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `avatars/${fileName}`
  }

  s3.deleteObject(params, (err, data) => {
    if (err) throw err;
    else console.log('The avatar was successfully deleted from the bucket!');
  })
}
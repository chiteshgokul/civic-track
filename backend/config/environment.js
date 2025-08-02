 require('dotenv').config();

/**
 * Environment configuration
 */
const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    s3Bucket: process.env.S3_BUCKET
  }
};

module.exports = config;
 const AWS = require('aws-sdk');
const config = require('../config/environment');
const logger = require('../utils/logger');

const s3 = new AWS.S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region
});

/**
 * Uploads a photo to S3
 * @param {Object} file - File object from multer
 * @returns {Promise<string>} S3 URL
 */
const uploadPhoto = async (file) => {
  try {
    const params = {
      Bucket: config.aws.s3Bucket,
      Key: `photos/${Date.now()}_${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype
    };
    const { Location } = await s3.upload(params).promise();
    return Location;
  } catch (error) {
    logger.error('S3 upload error:', error);
    throw error;
  }
};

module.exports = { uploadPhoto };
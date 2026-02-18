const fp = require('fastify-plugin');
const { Storage } = require('@google-cloud/storage');

const cloudStorage = new Storage();

class BucketOperations {
  constructor({ bucket_name }) {
    this.cloudBucket = cloudStorage.bucket(bucket_name);
  }

  async getReadStream({ file_path }) {
    return this.cloudBucket.file(file_path).createReadStream();
  }

  async createWriteStream({ file_path }) {
    return this.cloudBucket.file(file_path).createWriteStream();
  }

  async saveFileBuffer({ file_path, buffer }) {
    const fileRef = this.cloudBucket.file(file_path);
    console.log('Buffer content:', buffer);
    if (!buffer || buffer.length === 0) {
      console.error('Empty buffer, not uploading.');
      return false;
    }

    try {
      await fileRef.save(buffer);
      return true; // Return true if the save operation was successful
    } catch (error) {
      console.error('Error saving file:', error);
      return false; // Return false if there was an error during the save operation
    }

  }

  async getFileMetaData({ file_path }) {
    return this.cloudBucket.file(file_path).getMetadata();
  }
}

function bucketOperationsPlugin(fastify, opts, next) {
  fastify.decorate('bucketOperations', new BucketOperations({
    bucket_name: opts.bucketName
  }));
  next();
}

module.exports = fp(bucketOperationsPlugin, { name: 'bucketOperations' });

"use strict";

const Util = require('util');
const Async = require('async');
const AWS = require('aws-sdk');
const Stream = require('stream');
const Mozjpeg = require('./Mozjpeg');
const Pngquant = require('./Pngquant');

class Processor {
  constructor(backet, objectKey, callback) {
    this.srcBucket = backet;
    this.srcKey = objectKey;
    this.dstKey = "resized-" + this.srcKey;
    this.backupKey = "original-" + this.srcKey;
    this.callback = callback;

    let typeMatch = this.srcKey.toLowerCase().match(/\.([^.]*)$/);
    if (!typeMatch) {
        callback("Could not determine the image type.");
        return;
    }

    this.imageType = typeMatch[1];
    if (this.imageType != "jpg" && this.imageType != "jpeg" && this.imageType != "png") {
        callback('Unsupported image type: ${imageType}');
        return;
    }
  }

  process() {
    const self = this;

    Async.waterfall([
      this.check.bind(self),
      this.backup.bind(self),
      this.reduce.bind(self),
    ], this.notify.bind(self));
  }

  check(next) {
    console.log("check");
    const s3 = new AWS.S3();

    s3.headObject({
      Bucket: this.srcBucket,
      Key: this.backupKey
    }, function(error, _){
      if (error) {
        console.log(error.statusCode);
        next(null);
      } else {
        console.log("already processed");
        next("already processed");
      }
    });
  }

  backup(next) {
    console.log("backup");

    const s3 = new AWS.S3();

    s3.copyObject({
      Bucket: this.srcBucket,
      CopySource: this.srcBucket + "/" + this.srcKey,
      Key: this.backupKey
    }, function(error, _){
      console.log("backup completed");
      next(null);
    });
  }

  reduce(next) {
    console.log("reduce");

    const s3 = new AWS.S3();
    const readStream = s3.getObject({
      Bucket: this.srcBucket,
      Key: this.srcKey
    }).createReadStream();

    const writeStream = new Stream.PassThrough();

    s3.upload({
      Bucket: this.srcBucket,
      Key: this.dstKey,
      Body: writeStream
    }, next);

    const reduceStream = this.reduceStream(this.imageType);

    readStream.pipe(reduceStream).pipe(writeStream);
  }

  notify(error) {
    if (error) {
      let message = 'Unable to reduce ' + this.srcBucket + '/' + this.srcKey +
          ' and backup to ' + this.srcBucket + '/' + this.backupKey +
          ' and upload to ' + this.srcBucket + '/' + this.dstKey +
          ' due to an error: ' + error;

      console.error(message);
      this.callback(message);
    } else {
      let message = 'Successfully resuceed ' + this.srcBucket + '/' + this.srcKey +
          ' and backuped to ' + this.srcBucket + '/' + this.backupKey +
          ' and uploaded to ' + this.srcBucket + '/' + this.dstKey;

      console.log(message);
      this.callback(null, message);
    }
  }

  reduceStream(type) {
    switch (type) {
    case "jpg":
    case "jpeg":
      return new Mozjpeg().createStream();
      break;
    case "png":
      return new Pngquant().createStream();
      break;
    default:
      throw new Error("Unexpected output type: " + type);
    }
  }
};

module.exports = Processor;

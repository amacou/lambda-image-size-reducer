"use strict";

const Util = require('util');
const Processor  = require('./lib/Processor');

exports.handler = function(event, context, callback) {
  console.log("Reading options from event:\n", Util.inspect(event, {depth: 5}));
  const srcBucket = event.Records[0].s3.bucket.name;
    // Object key may have spaces or unicode non-ASCII characters.
  const srcKey    = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
  const processor = new Processor(srcBucket, srcKey, callback);
  processor.process();
};

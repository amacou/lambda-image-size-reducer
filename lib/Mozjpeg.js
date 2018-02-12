"use strict";

const FS = require('fs');
const Path = require('path');
const DCP = require('duplex-child-process');

class Mozjpeg {
  constructor(opts) {
    const options = opts || {};
    const quality = options.quality || 75;
    this.args = [];
    this.args.push('-quality', quality);
    if (options.args) {
      this.args = this.args.concat(options.args.split(' '));
    }
  }

  createStream() {
    const mozjpegPath = Path.resolve(__dirname, "../bin/", process.platform, 'cjpeg');
    if (!FS.existsSync(mozjpegPath)) {
      throw new Error("Undefined binary: " + mozjpegPath);
    }

    return DCP.spawn(mozjpegPath, this.args);
  }
}

module.exports = Mozjpeg;

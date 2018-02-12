"use strict";

const FS = require('fs');
const Path = require('path');
const DCP = require('duplex-child-process');

class Pngquant {
  constructor(args) {
    this.args = args || ["--speed=1"];

    if (this.args.indexOf("-") === -1) {
      this.args.push("-");
    }
  }

  createStream() {
    const pngquantPath = Path.resolve(__dirname, "../bin/", process.platform, 'pngquant');
    if (!FS.existsSync(pngquantPath)) {
      throw new Error("Undefined binary: " + pngquantPath);
    }

    return DCP.spawn(pngquantPath, this.args);
  }
}

module.exports = Pngquant;

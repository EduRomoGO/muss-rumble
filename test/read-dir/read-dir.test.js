"use strict";

const chai = require("chai");
const should = chai.should();
const { readDir } = require("../../src/utils/read-dir");

describe("readDir module", function () {
  it("returns current", function () {
    const dirStructure = readDir();

    dirStructure.should.eql({ dir: "hey" });
  });
});

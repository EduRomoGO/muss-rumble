"use strict";

const chai = require("chai");
const should = chai.should();
const { readDir } = require("../../src/utils/traverse");

describe("readDir module", function () {
  it("returns current", function () {
    const dirStructure = readDir();

    dirStructure.should.eql({ dir: "hey" });
  });
});

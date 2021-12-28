const { storeJsonInFile } = require("./store-json-in-file");
const { traverse } = require("./traverse");
const util = require("util");

function getIndexFiles(files) {
  let indexFiles = [];

  files.forEach((file) => {
    if (file.type === "dir") {
      return getIndexFiles(file.files);
    }

    if (file.path.includes("index")) {
      indexFiles.push(file);
    }
  });

  return indexFiles;
}

function getStructure() {
  const files = traverse("/Users/EduRomoGO/Dropbox/1.info/0.Handle");

  const indexFiles = getIndexFiles(files);

  console.log(util.inspect(indexFiles, false, null));
  // console.log(util.inspect(files, false, null));
}

getStructure();

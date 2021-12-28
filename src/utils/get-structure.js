const { storeJsonInFile } = require("./store-json-in-file");
const { traverse } = require("./traverse");
const util = require("util");

function getIndexFiles(files, result = []) {
  files.forEach((file) => {
    if (file.type === "dir") {
      result.push(file);
      return getIndexFiles(file.files, result.files);
    }

    if (file.file.includes("index")) {
      result.push(file);
    }
  });

  return result;
}

function getStructure() {
  // const files = traverse("/Users/EduRomoGO/Dropbox/1.info/1.Dev");
  const files = traverse("/Users/EduRomoGO/Dropbox/1.info/0.Handle");

  const indexFiles = getIndexFiles(files);

  console.log(util.inspect(indexFiles, false, null));
  // console.log(util.inspect(files, false, null));
}

getStructure();

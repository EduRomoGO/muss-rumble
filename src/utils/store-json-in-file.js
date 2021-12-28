const fs = require("fs");

function storeJsonInFile(fileName, jsonContent) {
  const json = JSON.stringify(jsonContent, null, 4);

  fs.writeFile(`${process.cwd()}/${fileName}.json`, json, "utf8", function () {
    console.log(`created file ${fileName}!`);
  });
}

module.exports = {
  storeJsonInFile,
};

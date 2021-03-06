module.exports = {
  getRandomNumberFrom: (min, max) => {
    return Math.floor(Math.random() * max) + min;
  },

  // transforms a decimal number to binary
  dec2bin: function (dec) {
    if (dec > 0) {
      return "0" + (dec >>> 0).toString(2);
    } else {
      return (dec >>> 0).toString(2);
    }
  },

  // updates json file ({data: []}) from fileUrl with jsonData
  updateJsonFile: function (fileUrl, jsonData) {
    const fs = require("fs");

    fs.readFile(fileUrl, "utf8", function (err, fileData) {
      if (err) console.log(err);

      const fileObj = JSON.parse(fileData); //now it an object
      fileObj.data.push(jsonData); //add some data
      const json = JSON.stringify(fileObj, null, 4); //convert it back to json
      fs.writeFile(fileUrl, json, "utf8", function () {
        console.log("updated file with!");
      }); // write it back
    });
  },

  htmlDecode: (input) => {
    let doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  },

  escapeHtml: (html) => {
    let text = document.createTextNode(html);
    let p = document.createElement("p");
    p.appendChild(text);

    return p.innerHTML;
  },

  inspectObject: (o, i) => {
    if (typeof i == "undefined") i = "";
    if (i.length > 50) return "[MAX ITERATIONS]";
    var r = [];
    for (var p in o) {
      var t = typeof o[p];
      r.push(
        i +
          '"' +
          p +
          '" (' +
          t +
          ") => " +
          (t == "object" ? "object:" + inspect(o[p], i + "  ") : o[p] + "")
      );
    }
    return r.join(i + "\n");
  },
};

module.exports.getRandomNumberFrom = (min, max) => {
  return Math.floor(Math.random() * max) + min;
};

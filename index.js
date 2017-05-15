'use strict';

module.exports = {

	// transforms a decimal number to binary
	dec2bin: function (dec){
		console.log('dec2bin');
		if (dec > 0) { return '0' + (dec >>> 0).toString(2); }
	    else { return (dec >>> 0).toString(2); }
	},

	// updates json file ({data: []}) from fileUrl with jsonData
	updateJsonFile: function (fileUrl, jsonData) {
		const fs = require('fs');

		fs.readFile(fileUrl, 'utf8', function (err, fileData){
			if (err) console.log(err);

			const fileObj = JSON.parse(fileData); //now it an object
			fileObj.data.push(jsonData); //add some data
			const json = JSON.stringify(fileObj, null, 4); //convert it back to json
			fs.writeFile(fileUrl, json, 'utf8', function(){ console.log('updated file with!');}); // write it back 
		});
	}

};
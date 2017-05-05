'use strict';

module.exports = {

	// transforms a decimal number to binary
	dec2bin: function (dec){
		console.log('dec2bin');
		if (dec > 0) { return '0' + (dec >>> 0).toString(2); }
	    else { return (dec >>> 0).toString(2); }
	},

	
};
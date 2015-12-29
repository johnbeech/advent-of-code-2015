const request = require('request');
const denodeify = require('denodeify');

module.exports = denodeify(request);

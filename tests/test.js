var eveo = require('../lib/main');
var util = require('util');
var fs = require('fs');
var path = require('path');

var authFilePath = path.join(process.env.HOME, '.node-eveo');
var authfile = fs.readFileSync(authFilePath);
var auth = JSON.parse(authfile);

var cli = new eveo.Client(auth.ID, auth.Key);
cli.characters(null, function(err, data) {
  console.log(util.inspect(data, true, null));
});

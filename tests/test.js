var eveo = require('../lib/main');
var util = require('util');

var cli = new eveo.Client('blah', 'blah');
cli.skillTree(function(err, data) {
  console.log(util.inspect(data, true, null));
});

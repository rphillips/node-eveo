var eveo = require('../lib/main');
var util = require('util');
var fs = require('fs');
var path = require('path');

var authFilePath = path.join(process.env.HOME, '.node-eveo');
var authfile = fs.readFileSync(authFilePath);
var auth = JSON.parse(authfile);

var characterID;

exports['test_characters'] = function(test, assert) {
  var cli = new eveo.Client(auth.ID, auth.Key);
  cli.characters(null, function(err, data) {
    assert.ifError(err);
    characterID = data.result.rowset.row['@'].characterID;
    test.finish();
  });
};

exports['test_skillQueue'] = function(test, assert) {
  var cli = new eveo.Client(auth.ID, auth.Key);

  cli.skillQueue({ characterID: characterID }, function(err, data) {
    assert.ifError(err);
    test.finish();
  });
};

var https = require('https');
var querystring = require('querystring');
var xml2js = require('xml2js');
var log = require('logmagic').local('eveo.lib.client');


function Client(userID, userKey) {
  this.userID = userID;
  this.userKey = userKey;
};


Client.prototype._getPage = function(url, args, options, callback) {
  var parser, req, options, query;

  query = querystring.stringify({
    userID: this.userID,
    apiKey: this.userKey
  })

  options = {
    host: 'api.eveonline.com',
    path: url,
    method: 'POST',
    headers: {
      'Content-Type' : 'application/x-www-form-urlencoded',
      'Content-Length' : query.length
    }

  };

  log.debug('_getPage', options);

  parser = new xml2js.Parser();

  req = https.request(options, function(res) {
    if (res.statusCode !== 200) {
      callback(new Error('Invalid Status Code'));
      return;
    }
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      parser.parseString(chunk);
    });
  });

  parser.addListener('end', function(result) {
    callback(null, result);
  });

  req.on('error', callback);

  req.write(query);
};


Client.prototype.skillTree = function(callback) {
  this._getPage('/eve/SkillTree.xml.aspx', null, null, callback);
};


Client.prototype.characters = function(callback) {
  this._getPage('/account/Characters.xml.aspx', null, null, callback);
};


exports.Client = Client;


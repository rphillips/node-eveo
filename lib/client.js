var https = require('https');
var querystring = require('querystring');
var xml2js = require('xml2js');


function Client(userID, userKey) {
  this.userID = userID;
  this.userKey = userKey;
};


Client.prototype._getPage = function(url, args, options, callback) {
  var parser, query, req, options = {
    host: 'api.eveonline.com',
    path: url,
    method: 'POST'
  };

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

  query = querystring.stringify({
    userid: this.userID,
    apikey: this.userKey
  });

  req.write(query);
};


Client.prototype.skillTree = function(callback) {
  this._getPage('/eve/SkillTree.xml.aspx', null, null, callback);
};


exports.Client = Client;


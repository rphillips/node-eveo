var https = require('https');
var querystring = require('querystring');
var xml2js = require('xml2js');
var log = require('logmagic').local('eveo.lib.client');

var CACHE = {
  SHORT: 0,
  M_SHORT: 1,
  LONG: 2
};

var apiMap = {
  'skillTree': {
    endpoint: '/eve/SkillTree.xml.aspx',
    cache: CACHE.M_SHORT
  },
  'characters': {
    endpoint: '/account/Characters.xml.aspx',
    cache: CACHE.SHORT
  },
  'skillQueue': {
    endpoint: '/char/SkillQueue.xml.aspx',
    validation: ['validationID'],
    cache: CACHE.M_SHORT
  },
  'skillInTraining': {
    endpoint: '/char/SkillInTraining.xml.aspx',
    validation: ['validationID'],
    cache: CACHE.SHORT
  }
};

function performGeneric(endpoint) {
  return function(args, callback) {
    this._getPage(endpoint, args, callback);
  };
}

function Client(userID, apiKey) {
  this.userID = userID;
  this.apiKey = apiKey;
};


Client.prototype._getPage = function(url, args, callback) {
  var parser, req, options, query;

  args = args || {};
  args.userID = this.userID;
  args.apiKey = this.apiKey;
  query = querystring.stringify(args);

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
  log.debug('_getPage[query]', query);

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

/* Attach API functions to prototype */
for (var key in apiMap) {
  Client.prototype[key] = performGeneric(apiMap[key].endpoint);
}

exports.Client = Client;


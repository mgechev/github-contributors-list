var q = require('q'),
    sprintf = require('sprintf-js').sprintf,
    https = require('https');

var requestOptions = {
  method: 'GET',
  host: 'api.github.com',
  port: 443,
  path: '/repos/%s/%s/contributors',
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'contributors-list'
  }
};

module.exports = {

  formatStrategy: function (contributors) {
    contributors = contributors.map(function (c) {
      return c.login;
    });
    return contributors.join(', ');
  },

  compare: function (a, b) {
    return b.contributions - a.contributions;
  },

  get: function (user, repo) {
    var deferred = q.defer(),
        output = '',
        self = this,
        contributorsArray;
    requestOptions.path = sprintf(requestOptions.path, user, repo);
    https.request(requestOptions, function (res) {
      res.on('data', function (chunk) {
        output += chunk;
      });
      res.on('end', function () {
        contributorsArray = JSON.parse(output);
        contributorsArray.sort(self.compare);
        deferred.resolve(self.formatStrategy(contributorsArray));
      });
    })
    .on('error', function (err) {
      deferred.reject(err);
    })
    .end();
    return deferred.promise;
  }

};
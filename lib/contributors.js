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

module.exports = function (options) {
  var user = options.user;
  var repo = options.repo;
  var result = [];
  var deferred = q.defer();
  return {
    get: function (path) {
      var output = '';
      var self = this;
      var contributorsArray;
      requestOptions.path = path || sprintf(requestOptions.path, user, repo);
      https.request(requestOptions, function (res) {
        res.on('data', function (chunk) {
          output += chunk;
        });
        res.on('end', function () {
          contributorsArray = JSON.parse(output);
          var next = res.headers.link;
          result = result.concat(contributorsArray);
          if (next && next.indexOf('next') >= 0) {
            next = next.split(',');
            next = next[0].match(/<(.*?)>/)[1];
            self.get(next);
          } else {
            result = result.sort(function (a, b) {
              return options.sortStrategy(a, b, options);
            });
            result = result.filter(function (u) {
              return options.filterStrategy(u, options);
            });
            deferred.resolve(options.layoutStrategy(options)(result));
            result = [];
            deferred = q.defer();
          }
        });
      })
      .on('error', function (err) {
        deferred.reject(err);
      })
      .end();
      return deferred.promise;
    }
  };
};

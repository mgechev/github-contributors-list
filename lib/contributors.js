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

function compareAsc(a, b) {
  return a.contributors - b.contributors;
}

function compareDesc(a, b) {
  return b.contributions - a.contributions;
}

module.exports = function (options) {
  var user = options.user,
      repo = options.repo,
      cmp = (options.sort === 'asc') ? compareAsc : compareDesc,
      strategy = options.strategy,
      result = [],
      deferred = q.defer();
  return {

    formatStrategy: strategy,

    compare: cmp,

    get: function (path) {
      var output = '',
          self = this,
          contributorsArray;
      requestOptions.path = path || sprintf(requestOptions.path, user, repo);
      https.request(requestOptions, function (res) {
        res.on('data', function (chunk) {
          output += chunk;
        });
        res.on('end', function () {
          contributorsArray = JSON.parse(output);
          contributorsArray.sort(self.compare);
          var next = res.headers.link;
          result = result.concat(contributorsArray);
          if (next && next.indexOf('next') >= 0) {
            next = next.split(',');
            next = next[0].match(/<(.*?)>/)[1];
            self.get(next);
          } else {
            deferred.resolve(self.formatStrategy(result));
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
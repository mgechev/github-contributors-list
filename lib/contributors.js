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

function compareAsc(prop, a, b) {
  var aval = a[prop];
  var bval = b[prop];
  if (typeof aval === 'number') {
    return a[prop] - b[prop];
  } else {
    if (aval > bval) {
      return 1;
    } else if (aval < bval) {
      return -1;
    } else {
      return 0;
    }
  }
}

function compareDesc(prop, a, b) {
  var aval = a[prop];
  var bval = b[prop];
  if (typeof aval === 'number') {
    return b[prop] - a[prop];
  } else {
    if (aval > bval) {
      return -1;
    } else if (aval < bval) {
      return 1;
    } else {
      return 0;
    }
  }
}

module.exports = function (options) {
  var user = options.user;
  var repo = options.repo;
  var sortBy = options.sortBy || 'contributions';
  var cmp = options.sortStrategy || ((options.sortOrder === 'asc') ? compareAsc : compareDesc).bind(null, sortBy);
  var strategy = options.strategy;
  var result = [];
  var deferred = q.defer();
  return {

    formatStrategy: strategy,

    compare: cmp,

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
            result = result.sort(self.compare);
            result = result.filter(function (u) {
              return options.filter.indexOf(u.login) < 0;
            });
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

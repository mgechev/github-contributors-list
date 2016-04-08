var q       = require('q'),
    sprintf = require('sprintf-js').sprintf,
    https   = require('https'),
    requestOptions = {
      port    : 443,
      method  : 'GET',
      host    : 'api.github.com',
      path    : '/repos/%s/%s/contributors',
      headers : {
        'Content-Type': 'application/json',
        'User-Agent'  : 'contributors-list'
      }
    };

/**
 * GitHub API Contributor Service
 */
module.exports = function contributorService(options) {

  var jsonResponse = '', result = [], deferred = q.defer(), self;
  var repository   = options.repository || options.repo;
  var owner        = options.owner      || options.user;

  if ( !repository || !owner) throw new Error("both arguments '--repo' and '--user' are required! ");

  var concatData     = function (chunk) { jsonResponse += chunk; };
  var reject         = function (e)   { deferred.reject(e); };
  var sortStrategy   = function (a,b) { return options.sortStrategy(a, b, options); };
  var filterStrategy = function (u)   { return options.filterStrategy(u, options);  };
  var layoutStrategy = function (u)   { return options.layoutStrategy(options)(u);  };

  return self = {
    get: function (path) {
      return q.Promise(function (resolve, reject, notify) {
        // Load 1...n pages of Contributors and transform all the data
        loadAll(path).then( function (result) {
          resolve( layoutStrategy(
            result.filter( filterStrategy ).sort( sortStrategy )
          ));
        }, reject);
      });
    }
  };

  function loadAll(path) {
    jsonResponse = '';
    requestOptions.path = path || sprintf(requestOptions.path, owner, repository);

    https.request(requestOptions, function (response) {

      response.on('error', reject );
      response.on('data', concatData);
      response.on('end', function () {
        result  = result.concat( JSON.parse(jsonResponse) );

        // Do we have more than 1 page of data ?
        var page = findPageLink(response);
        if ( page ) {
          loadAll(page);
          return;
        }

        deferred.resolve(result);
        cleanup();

      });

    }).end();

    return deferred.promise;
  }
  /**
   *
   */
  function cleanup() {
    result   = [ ];
    deferred = q.defer();
    jsonResponse = '';
  }

  /**
   *
   */
  function findPageLink(response) {
    var link = response.headers.link;
    var hasLink = link && link.indexOf('next') >= 0;
    if (hasLink) {
      link = link.split(',');
      link = link[0].match(/<(.*?)>/)[1];
    }
    return hasLink ? link : null;
  }

};

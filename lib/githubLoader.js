"use strict";

var q       = require('q'),
    https   = require('https'),
    merge   = require('merge'),
    sprintf = require('sprintf-js').sprintf;

var formatAPIError = function (response, result) {
  return sprintf('GitHubAPIError: statusCode=%d, statusMessage=%s,\nmessage=%s,\ndocumentation_url=%s',
                 response.statusCode, response.statusMessage,
                 result.message, result.documentation_url);
};

module.exports = function GitHubAPI(options) {

    // Publish simple API
    return {
      loadFrom : loadAllPages
    };

  /**
   * For the specified Github API EndPoint, load 1..n pages
   * of JSON data...
   */
  function loadAllPages( path, headers ) {
    var jsonResponse  = '', result = [], deferred = q.defer();
    var concatData    = function (chunk) {  jsonResponse += chunk;  };
    var reject        = function (e) { deferred.reject(e); };
    var requestOptions = {
      port    : 443,
      method  : 'GET',
      host    : 'api.github.com',
      headers : merge({
        'Content-Type': 'application/json',
        'User-Agent'  : 'contributors-list'
      }, headers || { })
    };

    // Load all data pages from the GitHub API using the requestOptions
    loadPage(path);

    return deferred.promise;

    /**
     *  Recursive function used to load 1..n pages of requets data,
     *  and resolve with formatted JSON results.
     */
    function loadPage( path ) {
      jsonResponse = '';
      if (path) requestOptions.path = path;

      https.request(requestOptions, function (response) {
        response.on('error', reject);
        response.on('data', concatData);
        response.on('end', function () {
          if (response.statusCode !== 200) {
            var thisResult = JSON.parse(jsonResponse);
            reject(formatAPIError(response, thisResult));
            return;
          }
          result = result.concat(JSON.parse(jsonResponse));

          // Do we have more than 1 page of data ?
          var page = findPageLink(response);
          if (page) {
            loadPage(page);
            return;
          }
          deferred.resolve(result);
          cleanup();
        });
      }).end();
    }

    /**
     * Cleanup paging caches
     */
    function cleanup() {
      result = [];
      deferred = q.defer();
      jsonResponse = '';
    }

    /**
     * Do we have another page of data that should be loaded
     * and concatenated ?
     */
    function findPageLink(response) {
      var link = response.headers.link;
      var hasLink = link && link.indexOf('next') >= 0;
      if (hasLink) {
        link = link.split(',');
        if (link[0].indexOf('next') !== -1) {
          link = link[0].match(/<(.*?)>/)[1];
        } else if (link[1].indexOf('next') !== -1) {
          link = link[1].match(/<(.*?)>/)[1];
        }
      }
      return hasLink ? link : null;
    }

  }
};

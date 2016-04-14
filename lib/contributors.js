"use strict";

var committers  = require('./committers');
var githubAPI   = require('./githubLoader');
var q           = require('q'),
    sprintf     = require('sprintf-js').sprintf,
    END_POINT   = '/repos/%s/%s/contributors';

/**
 * Service:  GitHub API Contributor
 */
module.exports = function $contributors(options) {

  var sortStrategy   = function (a,b) { return options.sortStrategy(a, b, options); };
  var filterStrategy = function (u)   { return options.filterStrategy(u, options);  };
  var layoutStrategy = function (u)   { return options.layoutStrategy(options)(u);  };

  // Publish $contributor service API

  return {
    loadAll: function (owner, repository, authToken, since) {
      var path    = sprintf( END_POINT, owner, repository );
      var headers = authToken ? { 'Authorization' : sprintf('token %s', authToken) } : null;

      // Publish promise for the 2-step load process

      return q.Promise(( resolve, reject ) =>{
        // Load list of commiters; each with a count of total # of commits
        committers(options)
            .loadSince( owner, repository, authToken, since )
            .then( loadContributors )
            .then( buildContributorTable )
            .then( resolve, reject );

        /**
         * Apply the strategies to build the output table of Contributors
         */
        function buildContributorTable(contributors) {
          return layoutStrategy(
            contributors
              .filter( filterStrategy )
              .sort( sortStrategy )
          );
        }

        /**
         * Load the contributor list and then filter by commits during the date range
         */
        function loadContributors( commitSummary ) {
           var knownCommitters =  function (it) {
                 // The contributor must be one of the authors listed in
                 // the current committers list (if the list is defined)
                 return !commitSummary ? true : !!commitSummary[ it.login ];
               };

           // Load 1...n pages of Contributors and transform all the data
           return githubAPI(options)
             .loadFrom(path, headers)
             .then( function (result) {
                return result.filter( knownCommitters );
             });
         }
      });
    }
  };

};

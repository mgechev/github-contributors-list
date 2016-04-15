var columnsCount, imageSize;

function getImageUrl(id) {
  var hasParams = (id.indexOf('?') > -1);
  return id + (!hasParams ? '?s=' : '&s=') + imageSize;
}

function formatRow(data, start) {
  var current = start, total = 0, result = [ ];
  while (current < data.length && total < columnsCount) {
    var it = data[current];

    /**
     *  {
     *    "login": "a8775",
     *    "id": 14092227,
     *    "avatar_url": "https://avatars.githubusercontent.com/u/14092227?v=3",
     *    "gravatar_id": "",
     *    "url": "https://api.github.com/users/a8775",
     *    "html_url": "https://github.com/a8775",
     *    "followers_url": "https://api.github.com/users/a8775/followers",
     *    "following_url": "https://api.github.com/users/a8775/following{/other_user}",
     *    "gists_url": "https://api.github.com/users/a8775/gists{/gist_id}",
     *    "starred_url": "https://api.github.com/users/a8775/starred{/owner}{/repo}",
     *    "subscriptions_url": "https://api.github.com/users/a8775/subscriptions",
     *    "organizations_url": "https://api.github.com/users/a8775/orgs",
     *    "repos_url": "https://api.github.com/users/a8775/repos",
     *    "events_url": "https://api.github.com/users/a8775/events{/privacy}",
     *    "received_events_url": "https://api.github.com/users/a8775/received_events",
     *    "type": "User",
     *    "site_admin": false,
     *    "contributions": 1
     *  }
     *
     *  Only publish a subset of these fields... those important for custom graphical
     *  table renderings
     *
     */
    result.push({
      url          : it.url,
      login        : it.login,
      avatar_url   : getImageUrl(it.avatar_url),
      html_url     : it.html_url,
      contributions: it.contributions
    });

    total += 1;
    current += 1;
  }
  return result;
}

function buildJSON(data) {
  var current = 0, result = [ ];

  data = data || [ ];
  while (current < data.length) {
    result.push(formatRow(data, current));
    current += columnsCount;
  }

  return {
    imageSize : imageSize,
    contributors : result
  };
}

module.exports = function (options) {
  options = options || {};
  imageSize = options.imagesize || 117;
  columnsCount = options.cols || 5;
  return buildJSON;
};


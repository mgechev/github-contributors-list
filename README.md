## Contributors list

Build awesome list of the contributors of your project! You can even filter your contributors to list only those individuals who committed after a specific date or who committed to a specific branch or SHA.

![Demo](https://raw.githubusercontent.com/mgechev/github-contributors-list/master/assets/demo.png)

## Usage

In order to get the contributors list for your open-source project use:

```bash
githubcontrib --owner USERNAME --repo REPO_NAME --cols 6 --filter user1,user2,user3 | pbcopy
```

### Advanced API

| **Parameter name** | **Description**                                                   | **Default value**                      | **Sample value**                    |
|--------------------|-------------------------------------------------------------------|----------------------------------------|-------------------------------------|
| `repo`             | Repository name. ]                                                                      | (required)                                   | `--repo angular-material`              |
| `owner`             | Repository owner that the repo belongs to.                                                          | (required)                                  | `--owner angular`                    |
| `fromDate`   | YYYY-MM-DD used to determine only the contributors after the specified commit fromDate.                                                          | `''`  | `--fromDate 2016-04-01` |
| `sha`   | SHA or branch name to start listing commits from. Default == the repository’s default branch (usually master).                                                          | `''`  | `--sha e58f3629e` |
| `sortOrder`        | Specifies the sort order.                                                               | `'asc'`                                | `--sortOrder desc`                  |
| `sortBy`           | Specifies the sort property. It will be passed as third argument to the `sortStrategy`. | `'contributions'`                      | `--sortBy login`                    |
| `sortStrategy`     | Custom sort strategy. Built-in strategies support string and number comparison.         | `'../lib/sort_strategies/sort_asc.js'` | `--sortStrategy custom_sort.js`     |
| `layoutStrategy`   | Specifies how the output will be formatted.                                             | `'../lib/layout_strategies/table.js'`  | `--layoutStrategy custom_layout.js` |
| `filter`           | Specifies users to be filtered.                                                         | `[]`                                   | `--filter userlogin1,userlogin2`    |
| `filterStrategy`   | Specifies the filter strategy.                                                          | `'../lib/filter_strategies/login.js'`  | `--filterStrategy custom_filter.js` |
| `authToken`   | Specifies the scope-limited Github oAuth application token: required increase your request rate limit to 5000 / hour.                                                          | `''`  | `--authToken 0da9a3f98dff9a61a0222fd5db201221c5b129f8` |

This way your contributors will be formatted in a table with their photos.

The table strategy accepts the following parameters:

- `image-size` - Number - size of the user's avatars
- `format` - Enum - `MARKDOWN` or `HTML`. Default == `HTML`
- `showlogin` - Boolean, indicates whether the login of the contributor should be shown in the table. Default == `false`
- `columns-count` - Number - number of columns for the table

## Different ways of formatting

You can easily add more formatting strategies by exporting the formatting logic.

Here's a sample implementation of a list layout strategy:

```js
var formatter = function (options) {
  options = options || {};
  var field = options.field || 'login',
      numbered = options.style === 'numbers';

  return function (data) {
    var result = '\n';
    data.forEach(function (user, idx) {
      if (numbered) {
        result += idx + 1;
      } else {
        result += '-';
      }
      result += ' ' + user[field] + '\n';
    });
    return result;
  };
};

module.exports = formatter;
```

## Testing with Curl

You can easily use the command line to query for a single page of information from the Github API.

* Get List of commits for the repository since 4/1/2016:
```console
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: token <accessToken>"  -X GET -d '{"since":"2016-04-01T00:00:00"}' https://api.github.com/repos/<owner>/<repository>/commits  > commits.json
```

* Get list of contributors for the repository:
```console
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: token <accessToken>" -X GET https://api.github.com/repos/<owner>/<repository>/contributors  > contributors.json
```

<br/>

If, however, you want all the data and the full power... use `githubcontrib` to get a list of contributors, supports 1..n pages of data, and will format the JSON as Markdown or HTML tables

```console
node githubcontrib --owner angular --repository material --sha master --since 2016-04-01 --cols 6 --sortOrder desc --format md --showlogin true  > ../contributions.md
```



## GitHub Limit

The Github API has a 60-requests-per-hour rate-limit for non-authenticated use. If you need some more then a scope-limited Github OAuth token can be used to boost the limit to 5000.

## License

MIT

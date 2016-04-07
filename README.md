## Contributors list

Build awesome list of the contributors of your project!

![alt tag](https://raw.githubusercontent.com/mgechev/github-contributors-list/master/assets/demo.png)

## Usage

In order to get the contributors list for your open-source project use:

```bash
githubcontrib --repo REPO_NAME --cols 6 --user USERNAME --filter user1,user2,user3 | pbcopy
```

### Advanced API

| **Parameter name** | **Description**                                                                         | **Default value**                      | **Sample value**                    |
|--------------------|-----------------------------------------------------------------------------------------|----------------------------------------|-------------------------------------|
| `repo`             | Repository name.                                                                        | `''`                                   | `--repo angular2-seed`              |
| `user`             | User that the repo belongs to.                                                          | `''`                                   | `--user mgechev`                    |
| `sortOrder`        | Specifies the sort order.                                                               | `'asc'`                                | `--sortOrder desc`                  |
| `sortBy`           | Specifies the sort property. It will be passed as third argument to the `sortStrategy`. | `'contributions'`                      | `--sortBy login`                    |
| `sortStrategy`     | Custom sort strategy. Built-in strategies support string and number comparison.         | `'../lib/sort_strategies/sort_asc.js'` | `--sortStrategy custom_sort.js`     |
| `layoutStrategy`   | Specifies how the output will be formatted.                                             | `'../lib/layout_strategies/table.js'`  | `--layoutStrategy custom_layout.js` |
| `filter`           | Specifies users to be filtered.                                                         | `[]`                                   | `--filter userlogin1,userlogin2`    |
| `filterStrategy`   | Specifies the filter strategy.                                                          | `'../lib/filter_strategies/login.js'`  | `--filterStrategy custom_filter.js` |

This way your contributors will be formatted in a table with their photos.

The table strategy accepts the following parameters:

- `image-size` - Number - size of the user's avatars
- `format` - Enum - `MARKDOWN` or `HTML`
- `show-logins` - Boolean, indicates whether the login of the contributor should be shown in the table
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
## GitHub Limit

The Github API has a 60-requests-per-hour rate-limit for non-authenticated use. If you need some more then a scope-limited Github OAuth token can be used to boost the limit to 5000.

## License

MIT

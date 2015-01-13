## Contributors list

Gets the contributors for given open GitHub repository and outputs them in specific format.

## Usage

In order to get the contributors list for your open-source project use:

```bash
node index.js --repo REPO_NAME --cols 6 --user USERNAME --strategy table | pbcopy
```

This way your contributors will be formatted in a table with their photos.

Currently there're two format strategies:

- table
- list

The table strategy accepts the following parameters:

- `image-size` - Number - size of the user's avatars
- `format` - Enum - `MARKDOWN` or `HTML`
- `show-logins` - Boolean, indicates whether the login of the contributor should be shown in the table
- `columns-count` - Number - number of columns for the table

## Different ways of formatting

You can easily add more formatting strategies by exporting the formatting logic. Each strategy is located under `./lib/strategies`.

For further details of how to implement a formatting strategy take a look at the already implemented ones.

## License

MIT

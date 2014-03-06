var args = require('minimalist')(process.argv.slice(2)),
    contributors = require('./lib/contributors'),
    table = require('./lib/strategies/table'),
    list = require('./lib/strategies/list'),
    strategies = {
      table: table,
      list: list
    };



contributors.formatStrategy = tablePhotos;

contributors.get(process.argv[2], process.argv[3])
.then(function (obj) {
  console.log(obj);
});
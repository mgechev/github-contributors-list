var contributors = require('./lib/contributors'),
    tablePhotos = require('./lib/strategies/table-photos');

contributors.formatStrategy = tablePhotos;

contributors.get(process.argv[2], process.argv[3])
.then(function (obj) {
  console.log(obj);
});
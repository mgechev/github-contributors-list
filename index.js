var contributors = require('./lib/contributors'),
    tablePhotos = require('./lib/strategies/table-photos');

tablePhotos.setCols(5);

contributors.formatStrategy = tablePhotos;

contributors.get(process.argv[2], process.argv[3])
.then(function (obj) {
  console.log(obj);
});
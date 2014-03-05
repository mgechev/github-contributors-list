var contributors = require('./lib/contributors'),
    tablePhotos = require('./lib/strategies/table-photos');

contributors.get('mgechev', 'angularjs-style-guide')
.then(function (obj) {
  console.log(obj);
});

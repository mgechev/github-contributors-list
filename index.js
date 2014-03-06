var args = require('minimist')(process.argv.slice(2)),
    contributors = require('./lib/contributors'),
    table = require('./lib/strategies/table'),
    list = require('./lib/strategies/list'),
    strategies = {
      table: table,
      list: list
    };

if (args.layout) {
  if (!strategies[args.layout]) {
    throw new Error('Invalid layout strategy', args.layout);
  }
} else {
  args.layout = 'table';
}

args.strategy = strategies[args.layout](args);
contributors = contributors(args);

contributors.get()
.then(function (obj) {
  console.log(obj);
});
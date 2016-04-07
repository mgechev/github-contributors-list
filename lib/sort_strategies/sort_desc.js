module.exports = function compareDesc(a, b, options) {
  var prop = options.sortBy;
  var aval = a[prop];
  var bval = b[prop];
  if (typeof aval === 'number') {
    return b[prop] - a[prop];
  } else {
    if (aval > bval) {
      return -1;
    } else if (aval < bval) {
      return 1;
    } else {
      return 0;
    }
  }
}


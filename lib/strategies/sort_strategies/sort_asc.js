module.exports = function compareAsc(a, b, options) {
  var prop = options.sortBy;
  var aval = a[prop];
  var bval = b[prop];
  if (typeof aval === 'number') {
    return a[prop] - b[prop];
  } else {
    if (aval > bval) {
      return 1;
    } else if (aval < bval) {
      return -1;
    } else {
      return 0;
    }
  }
}


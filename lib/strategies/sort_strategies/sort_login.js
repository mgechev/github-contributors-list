module.exports = function compareAsc(a, b, options) {
  var prop = options.sortBy;
  var aval = String(a[prop]).toLowerCase();
  var bval = String(b[prop]).toLowerCase();

  return  (typeof a[prop] === 'number') ? a[prop] - b[prop] :
          ((aval > bval) ? 1 : (aval < bval) ? -1 : 0);
}


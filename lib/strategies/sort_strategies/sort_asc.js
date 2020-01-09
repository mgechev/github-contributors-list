module.exports = function compareAsc(a, b, options) {
  var prop = options.sortBy;
  var aval = a[prop];
  var bval = b[prop];

  return  (typeof a[prop] === 'number') ? a[prop] - b[prop] :
          ((aval > bval) ? 1 : (aval < bval) ? -1 : 0);
};

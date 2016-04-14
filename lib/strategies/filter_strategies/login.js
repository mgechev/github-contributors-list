module.exports = function (u, options) {
  return options.filter.indexOf(u.login) < 0;
};


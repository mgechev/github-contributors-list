var formatter = function (options) {

  var field = options.field || 'login',
      numbered = options.style === 'numbers';

  return function (data) {
    var result = '\n';
    data.forEach(function (user, idx) {
      if (numbered) {
        result += idx + 1;
      } else {
        result += '-';
      }
      result += ' ' + user[field] + '\n';
    });
    return result;
  };
};

module.exports = formatter;
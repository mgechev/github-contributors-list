var FORMATS = {
    MARKDOWN: 'md',
    HTML: 'html'
  },
  format = FORMATS.MARKDOWN;

var formatter = function (array) {
  return array.join();
};

formatter.setOutputFormat = function (fm) {
  var supported = false;
  Object.keys(FORMATS).forEach(function (f) {
    if (f === fm) {
      supported = true;
      return;
    }
  });
  if (!supported) {
    throw new Error('Format', fm, 'not supported');
  }
  format = fm;
};

module.exports = formatter;
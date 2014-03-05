var toMarkdown = require('to-markdown').toMarkdown;

var FORMATS = {
    MARKDOWN: 'md',
    HTML: 'html'
  },
  MAX_PIC_SIZE = 2048,
  MIN_PIC_SIZE = 1,
  GRAVATAR_URL = 'http://www.gravatar.com/avatar/',
  format = FORMATS.HTML,
  columnsCount = 10,
  imageSize = 100;

function getImageUrl(id) {
  return GRAVATAR_URL + id + '?s=' + imageSize;
}

var formatter = function (array) {
  var result = '<table>';
  array.forEach(function (c, idx) {
    if (idx % columnsCount === 0) {
      if (idx) {
        result += '</tr>';
      }
      result += '<tr>';
    }
    result += '<td>';
    result += '<img src="' + getImageUrl(c.gravatar_id) + '" />';
    result += '</td>';
  });
  if (format === FORMATS.MARKDOWN) {
    return toMarkdown(result);
  } else {
    return result;
  }
};

formatter.setImageSize = function (size) {
  if (MAX_PIC_SIZE > 2048 || MIN_PIC_SIZE < 1) {
    throw new Error('The size should be between', MAX_PIC_SIZE, 'and', MIN_PIC_SIZE, 'pixels');
  }
  imageSize = size;
};

formatter.setCols = function (c) {
  if (c > 0) columnsCount = c;
  else throw new Error('The columns count should be more than 0');
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
var FORMATS = {
    MARKDOWN: 'md',
    HTML: 'html'
  },
  MAX_PIC_SIZE = 2048,
  MIN_PIC_SIZE = 1,
  format = FORMATS.MARKDOWN,
  columnsCount = 3,
  imageSize = 200;

function getImageUrl(url) {
  return url.replace(/x$/, imageSize);
}

var formatter = function (array) {
  var result = '<table>',
      openColumn = false;
  array.forEach(function (c, idx) {
    if (idx && idx % columnsCount === 0) {
      openColumn = true;
      result += '<tr>';
    }
    result += '<td>';
    result += '<img src="' + getImageUrl(c.avatar_url) + '" />';
    result += '</td>';
    if (openColumn) {
      openColumn = false;
      result += '</tr>';
    }
  });
  if (format === FORMATS.MARKDOWN) {
    return markdown.toMarkdown(result);
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
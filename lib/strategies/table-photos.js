var sprintf = require('sprintf-js').sprintf;

var FORMATS = {
    MARKDOWN: 'md'
  },
  MAX_PIC_SIZE = 2048,
  MIN_PIC_SIZE = 1,
  GRAVATAR_URL = 'http://www.gravatar.com/avatar/',
  format = FORMATS.HTML,
  columnsCount = 3,
  imageSize = 117;

function getImageUrl(id) {
  return GRAVATAR_URL + id + '?s=' + imageSize;
}

function formatHeaderCell(data, idx) {
  var avatar = getImageUrl(data.gravatar_id);
  return sprintf('[![%s](%s)](%s) |', data.login, avatar, data.html_url);
}

function formatBottomCell(data, idx) {
  return sprintf('[%(login)s](%(html_url)s) |', data);
}

function formatRow(data, start, callback) {
  var current = start,
      total = 0,
      result = '';
  while (current < data.length && total < columnsCount) {
    result += callback(data[current], total);
    total += 1;
    current += 1;
  }
  return result;
}

function formatData(data) {
  var current = 0,
      result = '';
  while (current < data.length) {
    result += formatRow(data, current, formatHeaderCell);
    if (formatter.showLogins) {
      result += '\n';
      result += formatRow(data, current, function (data, idx) {
        return ':---: |';
      });
      result += '\n';
      result += formatRow(data, current, formatBottomCell);
    }
    result += '\n\n';
    current += columnsCount;
  }
  return result;
}

var formatter = function (array) {
  return formatData(array);
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

formatter.showLogins = true;

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
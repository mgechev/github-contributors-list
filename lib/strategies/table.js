var sprintf = require('sprintf-js').sprintf;

var FORMATS = {
    MARKDOWN: 'md'
  },
  GRAVATAR_URL = 'http://www.gravatar.com/avatar/',
  format = FORMATS.HTML,
  columnsCount, imageSize, showLogins;

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
    if (showLogins) {
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

module.exports = function (options) {
  options = options || {};
  imageSize = options.imagesize || 117;
  format = FORMATS.MARKDOWN;
  showLogins = !!options.showlogin;
  columnsCount = options.cols || 5;
  return formatter;
};
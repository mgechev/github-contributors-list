var sprintf = require('sprintf-js').sprintf,
    marked = require('marked');

var FORMATS = {
    MARKDOWN: 'md',
    HTML: 'html'
  },
  format = FORMATS.HTML,
  columnsCount, imageSize, showLogins;

function getImageUrl(id) {
  if (id.indexOf('?') < 0) {
    return id + '?s=' + imageSize;
  } else {
    return id + '&s=' + imageSize;
  }
}

function formatHeaderCell(data, idx) {
  var avatar = getImageUrl(data.avatar_url);
  if (showLogins) {
    return sprintf('[<img alt="%s" src="%s" width="%s">](%s) |', data.login, avatar, imageSize, data.html_url);
  } else {
    return sprintf('[<img alt="%s" src="%s" width="%s">](%s)', data.login, avatar, imageSize, data.html_url);
  }
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

function buildMarkdownTable(data) {
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
  var table = buildMarkdownTable(array);
  if (format === FORMATS.HTML) {
    return marked(table);
  } else {
    return table;
  }
};

function getFormat(format) {
  var regex = new RegExp(Object.keys(FORMATS).map(function (f) {
    return FORMATS[f];
  }).join('|'));
  if (regex.test(format)) {
    return format;
  } else {
    return FORMATS.MD;
  }
}

module.exports = function (options) {
  options = options || {};
  imageSize = options.imagesize || 117;
  format = getFormat(options.format);
  showLogins = !!options.showlogin && /^(true|1)$/.test(options.showlogin);
  columnsCount = options.cols || 5;
  return formatter;
};


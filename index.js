
/**
 * 単純な文字列のパーサを生成する
 * 
 * @param {String} str
 * @return {Function} parser function
 */
function token(str) {
  var len = str.length;

  return function(target, position) {
    if (target.substr(position, len) === str) {
      return [true, str, position + len];
    } else {
      return [false, null, position];
    }
  };
}

/**
 * パーサを受け取って、そのパーサの解釈できる文字列を
 * 繰り返した文字列を解釈できるパーサを生成する
 * 
 * @param {Function} parser
 * @return {Function}
 */
function many(parser) {
  return function(target, position) {
    var result = [];

    for (;;) { 
      var parsed = parser(target, position);
      // 受け取ったパーサが成功したら
      if (parsed[0]) {
        result.push(parsed[1]); // 結果を格納して
        position = parsed[2];   // 読み取り位置を更新する
      } else {
        break;
      }
    }

    return [true, result, position];
  }
}

/**
 * @param {Array} parsers... パーサの配列
 * @return {Function} 
 */
function choice(/* parsers... */) {
  var parsers = arguments;

  return function(target, position) {
    var success = true;

    for (var i = 0; i < parsers.length; i++) {
      var parsed = parsers[i](target, position);
      // パース成功したら結果をそのまま帰す
      if (parsed[0]) {
        return parsed;
      }
    }

    return [false, null, position];
  };
}

/**
 * @param {Array} parsers... 結合するパーサの配列
 * @return {Function} パーサ
 */
function seq(/* parsers... */) {
  var parsers = arguments;

  return function(target, position) {
    var result = [];
    for (var i = 0; i < parsers.length; i++) {
      var parsed = parsers[i](target, position);

      if (parsed[0]) {
        result.push(parsed[1]);
        position = parsed[2];
      } else {
        // 一つでも失敗を返せば、このパーサ自体が失敗を返す
        return parsed;
      }
    }
    return [true, result, position];
  };
}

/**
 * 正規表現を元のパーサを生成する
 * 
 * @param {RegExp} regexp
 * @return {Function}
 */
function regex(regexp) {
  regexp = new RegExp('^(?:' + regexp.source + ')', regexp.ignoreCase ? 'i' : '');

  return function(target, position) {
    regexp.lastIndex = 0;
    var regexResult = regexp.exec(target.slice(position));

    if (regexResult) {
      position += regexResult[0].length;
      return [true, regexResult[0], position];
    } else {
      return [false, null, position];
    }
  };
}

/**
 * @param {Function} fn
 * @return {Function}
 */
function lazy(fn) {
  var parser = null;
  return function(target, position) {
    if (!parser) {
      parser = fn();
    }
    
    return parser(target, position);
  };
}

/**
 * @param {Function} parser
 * @return {Function}
 */
function option(parser) {
  return function(target, position) {
    var result = parser(target, position);
    if (result[0]) {
      return result;
    } else {
      return [true, null, position];
    }
  };
}

/**
 * @param {Function} parser
 * @param {Function} fn
 * @return {Function} 
 */
function map(parser, fn) {
  return function(target, position) {
    var result = parser(target, position);
    if (result[0]) {
      return [result[0], fn(result[1]), result[2]];
    } else {
      return result;
    }
  };
}

/**
 * @param {Function} parser
 * @param {Function} fn
 * @return {Function} 
 */
function filter(parser, fn) {
  return function(target, position) {
    var result = parser(target, position);
    if (result[0]) {
      return [fn(result[1]), result[1], result[2]];
    } else {
      return result;
    }
  };
}

module.exports = {
  token: token,
  many: many,
  choice: choice,
  seq: seq,
  regex: regex,
  lazy: lazy,
  option: option,
  map: map,
  filter: filter
};

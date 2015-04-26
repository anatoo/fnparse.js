var $ = require('../');

var number = $.map($.regex(/[0-9]|[1-9][0-9]*/), function(num) {
  return parseInt(num, 10);
});
var operator = $.char('-+');
var parenthesis = $.lazy(function() {
  return $.map($.seq($.token('('), expression, $.token(')')), function(parsed) {
    return parsed[1];
  });
});
var atom = $.choice(number, parenthesis);
var expression = $.map($.seq(atom, $.many($.seq(operator, atom))), function(parsed) {
  // パースの結果を整形する
  return [parsed[0]].concat(parsed[1].reduce(function(result, item) {
    return result.concat(item);
  }, []));
});

var parse = function(target) {
  var result = expression(target, 0);

  if (!result[0]) {
    throw new Error('パースできなかったー');
  }

  if (target.length !== result[2]) {
    throw new Error('最後までパースできなかったー');
  }

  return result[1];
};

var result = parse('1+2-(3+1-((4)))');
console.log(JSON.stringify(result));

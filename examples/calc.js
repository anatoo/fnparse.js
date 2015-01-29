var $ = require('../');

var number = $.regex(/[0-9]|[1-9][0-9]*/);
var operator = $.regex(/-|\+/);
var atom = $.choice(number, $.lazy(function() {
  return parenthesis;
}));
var expression = $.seq(atom, $.many($.seq(operator, atom)));
var parenthesis = $.seq($.token('('), expression, $.token(')'));

var result = expression('1+2-(3+1)', 0);

console.log(result);
console.log(JSON.stringify(result[1], null, '  '));

var expect = require('chai').expect;
var $ = require('../');

describe('token()', function() {
  it('should succeed parsing', function() {
    var parse = $.token('hoge');

    expect(parse('hoge', 0)).is.eql([true, 'hoge', 4]);
    expect(parse('fuga', 0)).is.eql([false, null, 0]);
  });
});

describe('choice()', function() {
  it('should succeed parsing', function() {
    var parse = $.choice($.token('hoge'), $.token('fuga'));

    expect(parse('hoge', 0)).is.eql([true, 'hoge', 4]);
    expect(parse('fuga', 0)).is.eql([true, 'fuga', 4]);
    expect(parse('piyo', 0)).is.eql([false, null, 0]);
  });
});

describe('many()', function() {
  it('should succeed parsing', function() {
    var parse = $.many($.token('ab'));

    expect(parse('', 0)).is.eql([true, [], 0]);
    expect(parse('ab', 0)).is.eql([true, ['ab'], 2]);
    expect(parse('abab', 0)).is.eql([true, ['ab', 'ab'], 4]);
  });
});

describe('seq()', function() {
  it('should succeed parsing', function() {
    var parse = $.seq($.token('ab'), $.token('cd'), $.token('ef'));

    expect(parse('abcdef', 0)).is.eql([true, ['ab', 'cd', 'ef'], 6]);
  });
});

describe('regex()', function() {
  it('should succeed parsing', function() {
    var parse = $.regex(/hoge/);

    expect(parse('hoge', 0)).is.eql([true, 'hoge', 4]);
    expect(parse('ahoge', 0)).is.eql([false, null, 0]);
    expect(parse('ahoge', 1)).is.eql([true, 'hoge', 5]);
  });

  it('should succeed parsing number', function() {
    var parse = $.regex(/^[1-9][0-9]*|[0-9]/);

    expect(parse('0', 0)).is.eql([true, '0', 1]);
    expect(parse('10', 0)).is.eql([true, '10', 2]);
    expect(parse('(10', 0)).is.eql([false, null, 0]);
  });
});

describe('option()', function() {
  it('should succeed parsing', function() {
    var parse = $.option($.token('hoge'));

    expect(parse('hoge', 0)).is.eql([true, 'hoge', 4]);
    expect(parse('fuga', 0)).is.eql([true, null, 0]);
  });
});

describe('lazy()', function() {
  it('should succeed parsing', function() {
    var parse = $.lazy(function() {
      return $.token('hoge');
    });

    expect(parse('hoge', 0)).is.eql([true, 'hoge', 4]);
  });
});


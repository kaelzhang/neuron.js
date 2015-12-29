describe("parse_module_id()", function(){
  var cases = [
    {
      d: 'only name',
      a: 'zepto',
      e: {
        s: '',
        n: 'zepto',
        p: '',
        v: '*',
        id: 'zepto@*',
        k: 'zepto@*'
      }
    },

    {
      d: 'name, path',
      a: 'zepto/zepto.js',
      e: {
        s: '',
        n: 'zepto',
        p: '/zepto.js',
        v: '*',
        id: 'zepto@*/zepto.js',
        k: 'zepto@*'
      }
    },

    {
      d: 'name, version, path',
      a: 'zepto@1.1.0/a.js',
      e: {
        s: '',
        n: 'zepto',
        p: '/a.js',
        v: '1.1.0',
        id: 'zepto@1.1.0/a.js',
        k: 'zepto@1.1.0'
      }
    },

    {
      d: 'scope, name',
      a: '@facebook/zepto',
      e: {
        s: 'facebook',
        n: 'zepto',
        p: '',
        v: '*',
        id: '@facebook/zepto@*',
        k: '@facebook/zepto@*'
      }
    },

    {
      d: 'scope, name, version',
      a: '@facebook/zepto@1.0.0',
      e: {
        s: 'facebook',
        n: 'zepto',
        p: '',
        v: '1.0.0',
        id: '@facebook/zepto@1.0.0',
        k: '@facebook/zepto@1.0.0'
      }
    },

    {
      d: 'scope, name, version, path',
      a: '@facebook/zepto@1.0.0/a.js',
      e: {
        s: 'facebook',
        n: 'zepto',
        p: '/a.js',
        v: '1.0.0',
        id: '@facebook/zepto@1.0.0/a.js',
        k: '@facebook/zepto@1.0.0'
      }
    },

    {
      d: 'scope, no name, version, path',
      a: '@facebook/zepto/a.js',
      e: {
        s: 'facebook',
        n: 'zepto',
        p: '/a.js',
        v: '*',
        id: '@facebook/zepto@*/a.js',
        k: '@facebook/zepto@*'
      }
    }
  ];

  cases.forEach(function (c) {
    it(c.d, function(){
      var p = parse_module_id(c.a);
      expect(p).to.deep.equal(c.e);
    });
  });
});


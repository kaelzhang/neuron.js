define('dir-2@*/lib/dir/index.js', [], function (require, exports) {
  exports.a = 1;
}, {
  map: {}
});

define('dir-2@*/lib/index.js', ['./dir'], function (require, exports) {
  exports.a = require('./dir').a;
}, {
  main: true,
  map: {
    './dir': './dir/index.js'
  }
});


describe("require a directory", function(){
  it("dir", function(done){
    _use('dir', function (dir) {
      expect(dir.a).to.equal(1);
      done();
    });
  });

  it("dir-2: already loaded", function(done){
    _use('dir-2', function (dir) {
      expect(dir.a).to.equal(1);
      done();
    });
  });
});


/////////////////////////////////////////////////////////////////////////////

define('file-module2@*/lib/dir.json', [], function (require, exports, module) {
  module.exports = {
    "a": 1
  };
}, {
  map: {}
});


define('file-module2@*/lib/index.js', ['./dir'], function (require, exports) {
  exports.a = require('./dir').a;
}, {
  main: true,
  map: {
    './dir': './dir.json'
  }
});

/////////////////////////////////////////////////////////////////////////////

define('file-module3@*/lib/dir.json', [], function (require, exports, module) {
  module.exports = {
    "a": 1
  };
}, {
  map: {}
});


define('file-module3@*/lib/index.js', ['file-module3@*/lib/dir.json'], function (require, exports) {
  exports.a = require('./dir').a;
}, {
  main: true,
  map: {
    './dir': 'file-module3@*/lib/dir.json'
  }
});

/////////////////////////////////////////////////////////////////////////////

define('file-module4-dep@*', [], function(require, exports, module){
  module.exports = {
    a: 1
  };
}, {
  map: {}
});


define('file-module4-dep2@100.2.0', [], function(require, exports, module){
  module.exports = {
    b: 2
  };
}, {
  map: {}
});


define('file-module4-dep3@1.1.0', [], function(require, exports, module){
  module.exports = {
    c: 3
  };
}, {
  map: {}
});

define('file-module4-dep3@3.1.0', [], function(require, exports, module){
  module.exports = {
    c: 4
  };
}, {
  map: {}
});


define('file-module4@*/lib/dir.json', ['file-module4-dep@*'], function (require, exports, module) {
  module.exports = {
    "a": require('file-module4-dep').a,
    b: function(cb){
      require.async('file-module4-dep2', function (mod) {
        cb(mod.b);
      });
    },
    c: function(cb){
      require.async('file-module4-dep3', function (mod) {
        cb(mod.c);
      });
    },
    d: function(cb){
      require.async('./entry', function (mod) {
        cb(mod.d);
      });
    }
  };
}, {
  main: true,
  asyncDeps: [
    'file-module4-dep2@100.2.0',
    'file-module4-dep3@3.1.0'
  ],
  map: {
    // map has higher priority
    'file-module4-dep3': 'file-module4-dep3@1.1.0'
  },
  entries: [
    'lib/entry.json'
  ]
});


define('file-module4@*/lib/entry.json', [], function(require, exports, module){
  module.exports = {
    d: 5
  };
}, {
  map: {}
});


describe("file module fallback", function(){
  it("file-module, fallback to .js", function(done){
    _use('file-module@1.0.0', function (dir) {
      expect(dir.a).to.equal(1);
      done();
    });
  });

  it("file-module2, fallback to json", function(done){
    _use('file-module2', function (dir) {
      expect(dir.a).to.equal(1);
      done();
    });
  });

  it("file-module3, explicit dependencies", function(done){
    _use('file-module3', function (dir) {
      expect(dir.a).to.equal(1);
      done();
    });
  });

  it("file-module4, sync deps", function(done){
    _use('file-module4', function (dir) {
      expect(dir.a).to.equal(1);
      done();
    });
  });

  it("file-module4, async with asyncDeps", function(done){
    _use('file-module4', function (dir) {
      dir.b(function (b) {
        expect(b).to.equal(2);
        done();
      });
    });
  });

  it("file-module4, async: map > asyncDeps", function(done){
    _use('file-module4', function (dir) {
      dir.c(function (c) {
        expect(c).to.equal(3); // not 4
        done();
      });
    });
  });

  it("file-module4, async an entry which fallbacks to json", function(done){
    _use('file-module4', function (dir) {
      dir.d(function (d) {
        expect(d).to.equal(5); // not 4
        done();
      });
    });
  });
});

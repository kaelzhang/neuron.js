describe("normalizeArray()", function(){

var cases = [
{
  d: 'normal',
  a: ['a', '.', 'b', 'c'],
  e: 'a/b/c'
},
{
  d: 'with parent: ..',
  a: ['a', '..', 'b', 'c'],
  e: 'b/c'
},
{
  d: 'with many parents: ..',
  a: ['a', '..', 'b', '..', 'c'],
  e: 'c'
},
{
  d: 'with more parents: ..',
  a: ['a', '..', 'b', '..', '..', 'c'],
  e: '../c'
}
];

cases.forEach(function (c) {
  it(c.d, function(){
    // var r = normalize_array(c.a);
    // r = r.join('/')
    // expect(r).to.equal(c.e);
  });
});

});


describe("path_join()", function(){
  var cases = [
    ['a', 'b', 'a/b'],
    ['a/b', './c', 'a/b/c'],
    ['a/b', '../c', 'a/c'],
    ['a//b', './c', 'a/b/c'],
    ['../abc', './c', '../abc/c'],
    ['', './c', 'c'],
    ['', '../c', '../c']
  ];

  cases.forEach(function (c) {
    it(c.join(' '), function(){
      // expect(path_join(c[0], c[1])).to.equal(c[2]);
    });
  });
});

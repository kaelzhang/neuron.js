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
    var r = normalizeArray(c.a);
    r = r.join('/')
    expect(r).to.equal(c.e);
  });
});

});
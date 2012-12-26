var 

lang = require('../lang');


var 

a = ['1', ['2', ['3']], ['4']],

b = ['1', ['2', ['3']], ['4']],

c = ['1', ['2', []], null],

d = {
    '0': '1',
    '1': ['2', ['3']],
    '2': ['4']
}


console.log(lang.isEqual(a, b));
console.log(lang.isEqual(a, c));
console.log(lang.isEqual(a, d));

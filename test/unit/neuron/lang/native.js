describe('Neuron:lang/native', function(){
	describe('Array', function(){
		it('.indexOf()', function(){
			function foo(){}
		
			var a = [1, '2', foo, {}, 1, '2', foo, {}];
			
			expect( a.indexOf(1) ).toEqual(0);
			expect( a.indexOf(2) ).toEqual(-1);
			expect( a.indexOf('2') ).toEqual(1);
			
			expect( a.indexOf(function(){}) ).toEqual(-1);
			expect( a.indexOf(foo) ).toEqual(2);
			
			expect( a.indexOf({}) ).toEqual(-1);
		});
		
		
		it('.lastIndexOf()', function(){
			function foo(){}
		
			var a = [1, '2', foo, {}, 1, '2', foo, {}];
			
			expect( a.lastIndexOf(1) ).toEqual(4);
			expect( a.lastIndexOf(2) ).toEqual(-1);
			expect( a.lastIndexOf('2') ).toEqual(5);
			
			expect( a.lastIndexOf(function(){}) ).toEqual(-1);
			expect( a.lastIndexOf(foo) ).toEqual(6);
			
			expect( a.lastIndexOf({}) ).toEqual(-1);
		});
		
		
		it('.filter()', function(){
			function foo(){}
		
			var a = [1, '2', foo, {}, undefined, null, true],
				b = [1, '2', foo, {}, undefined, null, true];
			
			// test filter
			expect( a.filter(function(i){return i === 2;}).length ).toEqual(0);
			expect( a.filter(function(i){return NR.isFunction(i)})[0] ).toEqual(foo);
			expect( a.filter(function(i){return NR.isObject(i)}).length ).toEqual(1);
			expect( a.filter(function(i){return NR.isObject(i)})[0] === {} ).toBeFalsy();
			
			// test context
			expect( a.filter(function(i){return NR.isObject(i)})[0] === {} ).toBeFalsy();
		});
        describe('.forEach()', function (){
           it('fn passed in', function (){
                var arr = [1,2,3,4],
                    passed = true,
                    copy = [].concat(arr),
                    len = arr.length;

               arr.forEach(function (item, index){
                    arr[index] = item+1;
               });
               for(var i=0;i<len;i++){
                   if(copy[i] === (arr[i]-1)){
                       continue;
                   }else{
                       passed = false;
                   }
               }
               expect(passed).toBeTruthy();
           });

            it('fn, context passed in', function (){
                var arr = [1,2,3,4],
                    obj = {x:10},
                    passed = true,
                    copy = [].concat(arr),
                    len = arr.length;

               arr.forEach(function (item, index){
                    arr[index] = item+this.x;
               }, obj);
               for(var i=0;i<len;i++){
                   if(copy[i] === (arr[i]-obj.x)){
                       continue;
                   }else{
                       passed = false;
                   }
               }
               expect(passed).toBeTruthy();

            });
        });

        describe('.every()', function (){
            it('normal call', function (){
                var arr = [1,1,1,1];

                var passed = arr.every(function (item, index){
                    if(item!==1){
                        return false;
                    }else{
                        return true;
                    }
                });
                expect(passed).toBeTruthy();
            });
            it('special call', function (){
                var rs1 = Array.prototype.every.call(Array, function (item){
                    return false;
                });

                expect(rs1).toBeTruthy();

                var rs2 = Array.prototype.every.call({length:10, a:2}, function (item){
                    return false;
                });

                expect(rs2).toBeTruthy();
            });
        });


        describe('.map()', function (){
            it('normal call', function (){
                var arr = [1,2,3];
                var rs = arr.map(function (item){
                    return ++item;
                });
                expect(arr[0]+1 === rs[0] && arr[1]+1 === rs[1] && arr[2]+1 === rs[2]).toBeTruthy();
            });

            xit('special call', function (){
                Array.prototype.map.call(Array, function (item){return ++item});
            });
        });

        describe('.some()', function (){
            it('normal call', function (){
                var arr = [1,2,3];
                expect(arr.some(function (item){return item>2})).toBeTruthy();
                expect(arr.some(function (item){return item>12})).toBeFalsy();
            });
        });

        describe('.reduce()', function (){
            it('normal call', function (){
                expect([1,2,3].reduce(function(prev, curr){
                   return prev+curr
                })).toBe(6);
                expect([1,2,3,'s'].reduce(function(prev, curr){
                   return prev+curr
                })).toBe('6s');
            });
        });
        describe('.reduceRight()', function (){
            it('normal call', function (){
                expect([1,2,3].reduceRight(function(prev, curr){
                   return prev+curr
                })).toBe(6);
                expect([1,2,3,'s'].reduceRight(function(prev, curr){
                   return prev+curr
                })).toBe('s321');
            });
        });
	});


    describe('Object', function(){
        describe('Object.create()', function (){
            it('create a object', function (){
                var obj = {a:1, b:2},
                    newObject = Object.create(obj);

                expect(obj.isPrototypeOf(newObject)).toBeTruthy();
            });
        });
        describe('Object.keys()', function (){
            it('get keys of object', function (){
                var obj={a:1,b:2};

                expect(Object.keys(obj)).toEqual(["a", "b"]);
            });
            it('get keys of array', function (){
                var obj2 = [1,2];
                obj2.aa='1';
                expect(Object.keys(obj2)).toEqual(["0", "1", "aa"]);
            });

        });
    });


    describe('String', function(){
        describe('.trimLeft()', function (){
            it('trim-left a string', function (){
                var str = '   hello   ';
                expect(str.trimLeft()).toBe('hello   ');
            });
        });

        describe('.trimRight()', function (){
            it('trim-right a string', function (){
                var str = '   hello   ';
               expect(str.trimRight()).toBe('   hello');
            });
        });

        describe('.trim()', function (){
            it('trim a string', function (){
                var str = '   hello   ';
                expect(str.trim()).toBe('hello');
            });
        });
    });
});
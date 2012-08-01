describe('Neuron: dom/create: $.create()', function (){

    var $ = NR.DOM,
        tempWrap;

    beforeEach(function (){
        tempWrap = $(document.createElement('div'));
    });

    describe('is the dom created native', function (){
        it('-is it a Neuron DOM element', function (){
            expect($.create('div')._ === $()._).toBeTruthy();
        });
    });

    describe('fragment not passed in', function (){
        it('-fragment not passed in', function (){
            expect($.create().count()).toBe(0);
        });
    });
    describe('fragment passed in', function (){

        xit('-html fragment passed in', function (){
            expect($.create('<asd>').count()).toBe(0);
        });

        xit('-illegal string passed in, fragment passed in', function (){
            expect($.create('.##').count()).toBe(0);
        });

        it('-legal tag name passed in', function (){
            $.create('div').inject(tempWrap);
            expect(tempWrap.html()).toBe("<div></div>");
        });

        it('-custom tag name passed in', function (){
            $.create('custom').inject(tempWrap);
            expect(tempWrap.html()).toBe("<custom></custom>");
        });
    });
    /*
    describe('no attributes passed in', function (){

        if(NR.UA.ie<8){
            it('if ie lt 8', function (){
                expect($.create('div').inject(tempWrap).html()).toBe("<div></div>");
            });
        }else{
            it('if ie gte 8', function (){
                expect($.create('div').inject(tempWrap).html()).toBe("<div></div>");
            });
        }
    });
    */

    describe('has attributes passed in', function (){
        it('-checkbox-s checked passed in attributes', function (){

            expect($.create('input', {name: 'username', type: 'checkbox', checked:true}).get(0).attr("defaultChecked")).toBeTruthy();
        });

        it('-checkbox-s checked passed in attributes, no value', function (){
            expect($.create('input', {name: 'username', type: 'text', value: '1'}).get(0).val()).toBe("1");
        });

        it('-checkbox-s checked passed in attributes, value is false', function (){
            expect($.create('input', {name: 'username', type: 'checkbox', checked:false}).get(0).attr("defaultChecked")).not.toBeTruthy();
        });

        it('-checkbox-s checked passed in attributes, value is true', function (){
            expect($.create('input', {name: 'username', type: 'checkbox', checked:true}).get(0).attr("defaultChecked")).toBeTruthy();
        });
/*
        it('if ie lt 8 name and type passed in', function (){

        });

        it('if ie gte 8 name and type passed in', function (){

        });
*/
    });


});
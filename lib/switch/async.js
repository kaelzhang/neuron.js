	
function fackSync(data, callback){
    callback && callback();
};


var

METHODS = {
    _prepareItems: function(){
        var self = this,
            data = self.get('data'),
            data_max = self.get('dataLength') - 1,
            
            expect_left = Math.max(self.expectIndex, 0),
            
             // less than `dataLength` 
            expect_right = Math.min(expect_left + self.get('stage') - 1, data_max),
            
            is_forward = expect_left - self.activeIndex >= 0,
            
            data_right = self.dataRight,
            data_left = self.dataLeft,
            
            prefetch = self.get('prefetch'),
            
            // basic preload
            load_left = data_left,
            load_right = data_right,
            
            async_needed = true,
            load_start,
            load_amount;
        
        // positive direction    
        if(is_forward){
            load_right = Math.min(expect_right + prefetch, data_max);
        }else{
            load_left = Math.max(expect_left - prefetch, 0);
        }
        
        if(expect_right > data_right){
            load_start = data_right + 1;
            load_amount = load_right - data_right;
            
        }else if(expect_left < data_left){
            load_start = load_left;
            load_amount = data_left - load_left;
            
        }else{
            async_needed = false;
        }
        
        if(async_needed){
            // sync 变成一个获取和控制 async method 的方法，会自己处理异步请求结束的工作
            self.get('sync')({
                start: load_start,
                amount: load_amount
                
            }, function(rt){
                var itemData = rt.items, item, index,
                    start = load_start,
                    amount = load_amount,
                    i = 0,
                    renderer = self.get('itemRenderer');
                    
                for(; i < amount; i ++ ){
                    index = start + i;
                    data[index] = itemData[i];
                    
                    if(index >= expect_left && index <= expect_right && index < self.length){
                        item = self._getItem(index);
                        renderer.call(self, index).children().inject(item.empty().removeClass('pending'));
                    }
                }
                
                self.dataRight = Math.max(load_right, self.dataRight);
                self.dataLeft = Math.min(load_left, self.dataLeft);
                
                // self._lifeCycle.resume();
            });
        }
        
        self._before();
    }
};


module.exports = {
    name: 'async',
    
    ATTRS: {
        /**
         * @type {function()} method to fetching data
         */
        sync: {
            value: fackSync
        },
        
        prefetch: {
            getter: function(v){
                return v || this.get('move') * 2;
            }
        }
    },
    
    init: function(self){
        var EVENTS = self.get('EVENTS');
    }
};


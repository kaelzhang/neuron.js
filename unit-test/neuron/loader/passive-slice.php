<script>


KM.provide('test/minus', function(K, minus){
    console.log(minus, minus.go(1, 1));
});

KM.provide('test/add', function(K, add){
    console.log(add);
});


KM.define('test/add', function(){
    return {
        go: function(a, b){
            return a + b;
        }
    }
});



KM.define('test/minus', ['./add'], function(K, require){
    var add = require('test/add');
    
    
    return {
        go: function(a, b){
            return add.go(a, -b);
        }
    }
});





</script>
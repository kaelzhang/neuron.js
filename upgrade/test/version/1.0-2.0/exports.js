
// global DP
// expect: DP -> DP_global
// global DP and local DP must be distinguished, or after removing wrappers, there will be mistakes
var DP;

DP.a();

define([], function(K, require, exports){

// local DP
// expect: DP -> DP_local
var DP;

DP;

// code ...
K.xxx();

function a(){
    var NR;

    NR;

    var K;

    K;

    return {
        a: 3
    }
}


if(true){
    return {
        a: 2
    }
}


return {
    a: 1
};

});

function abc(K, require, exports){

// code ...
K.xxx();

function a(){
    var NR;

    NR;

    return {
        a: 3
    }
}


if(true){
    return {
        a: 2
    }
}


return {
    a: 1
};

}
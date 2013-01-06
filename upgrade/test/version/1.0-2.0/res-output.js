DP.define([], function(D, require, exports) {
    var // global 
    // should be standardized to $ = NR.DOM
    _$ = $, element = 0;
    // this is fatal!
    var NR_local;
    var selector = ".abc";
    // $(string) -> $(string).eq(0)
    // exclude:
    // $(id)
    _$("#abc").css("width");
    $(selector).css("width");
    D.DOM(selector).css("width");
    // should be NR.DOM
    DP.DOM(selector).css("width");
    $.all("a").css("width", 1);
    $.one("a").css("width", 1);
    var a = $.all(".a").find("bcd");
    a.next(".a").next(".c").child(".b").one("div");
    if (a.count() && a.get(0)) {
        element = a.el(0);
    }
    var K;
    K._type(abc);
    K.b = {};
    // should be NR.mix...
    DP.mix(K.b, {
        a: 1
    });
    function a() {
        // should not be replaced as 'var NR = K', the name of `DP` here should be mangled
        var DP = K;
        DP.mix();
        // should be NR_local.mix...
        NR_local.mix();
    }
});
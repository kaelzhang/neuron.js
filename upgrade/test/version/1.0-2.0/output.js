NR.define([], function(D, require, exports) {
    var _$ = $, element = 0;
    var selector = ".abc";
    _$("#abc").css("width");
    $(selector).css("width");
    D.DOM(selector).css("width");
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
    DP.mix(K.b, {
        a: 1
    });
    function a() {}
});
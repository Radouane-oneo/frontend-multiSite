require.config({
    paths: {
        "jquery": "../libs/jquery/jquery.min",
        "underscore": "../libs/underscore/underscore-min",
        "backbone": "../libs/backbone/backbone",
        "text": "../libs/requirejs-text/text",
        "fancybox": "../libs/fancybox/jquery.fancybox.pack"
    },
    shim: {
        "backbone": {
            deps: ["jquery", "underscore"],
            exports: "Backbone"
        },
        "fancybox":{
            deps: ["jquery"]
        },
        "views/payment":{
            deps: ["config","fancybox"]
        }
    },
    waitSeconds: 0,
    urlArgs: "t=" +  (new Date()).getTime()
});

require(['backbone', 'views/payment'], function(Backbone, payment){
    window.myPayment = new payment();
});

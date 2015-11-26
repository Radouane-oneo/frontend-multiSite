require.config({
    paths: {
        "jquery": "../libs/jquery/jquery.min",
        "underscore": "../libs/underscore/underscore-min",
        "backbone": "../libs/backbone/backbone",
        "text": "../libs/requirejs-text/text",
        "fancybox": "../libs/fancybox/jquery.fancybox.pack",
        "select2": "../libs/select2/select2.min"
    },
    shim: {
        "backbone": {
            deps: ["jquery", "underscore"],
            exports: "Backbone"
        },
        "fancybox":{
            deps: ["jquery"]
        },
        "select2":{
            deps: ["jquery"]
        },
        "views/checkout":{
            deps: ["config","fancybox","select2"]
        }
    },
    waitSeconds: 0,
    urlArgs: "t=" +  (new Date()).getTime()
});

require(['backbone', 'views/checkout'], function(Backbone, checkout){
    window.myCheckout = new checkout();
});

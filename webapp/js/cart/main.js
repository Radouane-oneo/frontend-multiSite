require.config({
    paths: {
        "jquery": "../libs/jquery/jquery.min",
        "underscore": "../libs/underscore/underscore-min",
        "backbone": "../libs/backbone/backbone",
        "text": "../libs/requirejs-text/text"
    },
    shim: {
        "backbone": {
            deps: ["jquery", "underscore"],
            exports: "Backbone"
        },
        "views/cart":{
            deps: ["config"]
        }
    },
    waitSeconds: 0,
    //urlArgs: "t=" +  (new Date()).getTime()
});

require(['backbone', 'views/cart'], function(Backbone, cart){
    new cart();
});

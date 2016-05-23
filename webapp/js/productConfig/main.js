require.config({
    paths: {
        "jquery": "../libs/jquery/jquery1.7.1",
        //"jquery": "../libs/jquery/jquery.min",
        "underscore": "../libs/underscore/underscore-min",
        "backbone": "../libs/backbone/backbone",
        "text": "../libs/requirejs-text/text"
    },
    shim: {
        "backbone": {
            deps: ["jquery", "underscore"],
            exports: "Backbone"
        },
        "views/productConfig":{
            deps: ["config"]
        }
    },
    waitSeconds: 0,
    urlArgs: "t=" +  (new Date()).getTime()
});

require(['backbone', 'views/productConfig'], function(Backbone, productConfig){
    new productConfig();
});

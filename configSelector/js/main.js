require.config({
    paths: {
        "jquery": "libs/jquery/jquery.min",
        "underscore": "libs/underscore/underscore-min",
        "backbone": "libs/backbone/backbone",
        "text": "libs/requirejs-text/text"
    },
    shim: {
        "backbone": {
            deps: ["jquery", "underscore"],
            exports: "Backbone"
        },
        "productConfig/views/productConfig":{
            deps: ["config"]
        }
    },
    waitSeconds: 0,
    urlArgs: "t=" +  (new Date()).getTime()
});

require(['backbone', 'productConfig/views/productConfig'], function(Backbone, productConfig){
    new productConfig();
});
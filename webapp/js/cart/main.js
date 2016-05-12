require.config({
    paths: {
        "jquery": "../libs/jquery/jquery1.7.1",
        "jquery-ui" : "../libs/jquery/jquery-ui",
        "jquery-once" : "../libs/jquery/jquery.once",
        //"jquery": "../libs/jquery/jquery.min",
        "underscore": "../libs/underscore/underscore-min",
        "backbone": "../libs/backbone/backbone",
        "text": "../libs/requirejs-text/text",
        "fancybox": "../libs/fancybox/jquery.fancybox.pack"
    },
    shim: {
    	"jquery-once": {
    		deps: ['jquery']
    	},
    	"jquery-ui": {
    		deps: ['jquery']
    	},
        "backbone": {
            deps: ["jquery", "underscore"],
            exports: "Backbone"
        },
        "fancybox":{
            deps: ["jquery"]
        },
        "views/cart":{
            deps: ["config", "jquery-once", "jquery-ui","fancybox"]
        }
    },
    waitSeconds: 0,
    urlArgs: "t=" +  (new Date()).getTime()
});

require(['backbone', 'views/cart'], function(Backbone, cart){
    window.myCart = new cart();
});

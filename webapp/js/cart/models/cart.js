define([
    'backbone'
], function (Backbone) {

    return Backbone.Model.extend({
        defaults: function() {
            this.config = require("config");
            return {
               "myProperty" : "azerty"
            }
        },
        initialize: function() {
            if(this.config.jobCreated === true){
                // load JobFull.html
                var jobempty = new jobempty({ el: $("#dtContainer") });
            }else {
                // load jobEmpty.html
                var jobFull = new jobFull({ el: $("#dtContainer") });
            }
        }
        
    });

});
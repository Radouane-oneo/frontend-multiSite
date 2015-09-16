define([
    'backbone'
], function (Backbone) {

    return Backbone.Model.extend({
        defaults: function() {
            this.config = require("config");
            return {
               
            }
        },
        initialize: function() {
           
        }
        
    });

});
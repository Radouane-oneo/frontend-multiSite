define([
    'backbone'
], function (Backbone, cart) {

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
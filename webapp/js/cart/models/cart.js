define([
    'backbone',
    'text!../templates/cart.html'
], function (Backbone, cart) {

    return Backbone.Model.extend({
        defaults: function() {
            this.config = require("config");
            return {
               
            }
        },
        initialize: function() {
            this.config = require("config");
            this.render();
            /*if(this.config.jobCreated === true){
                // load JobFull.html
                var jobempty = new jobempty({ el: $("#dtContainer") });
            }else {
                // load jobEmpty.html
                var jobFull = new jobFull({ el: $("#dtContainer") });
            }*/
        },

        render : function(){
            $(this.config.containerId).html(cart);
        }
        
    });

});
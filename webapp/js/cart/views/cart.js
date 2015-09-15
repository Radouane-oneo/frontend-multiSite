define([
    'backbone',
    '../models/cart',
    'text!../templates/cart.html'
], function (Backbone, cartModel, cartTemplate) {

    return Backbone.View.extend({
        template: _.template(cartTemplate),
        events: {
        },
        initialize: function() {
            this.config = require("config");
            this.model = new cartModel();
            this.render();
            this.model.on("change",this.render,this);
        },
        render:function(){
            this.setElement(this.template({
                "model" : this.model.toJSON(),
                "config" : this.config
                
            }));
            
            $(this.config.containerId).html(this.$el);
        }
        
    });

});
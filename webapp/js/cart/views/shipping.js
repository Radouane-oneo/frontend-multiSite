define([
    'backbone',
    'text!../templates/shipping.html'
], function (Backbone, shippingTemplate) {

    return Backbone.View.extend({
        template: _.template(shippingTemplate),
        events: {
        },
        initialize: function(model) {
            this.config = require("config");
            this.model = model;
            this.render();
            this.model.on("change",this.render,this);
        },
        render:function(){
            this.setElement(this.template({
                "model" : this.model.toJSON(),
                "config" : this.config
            }));

            $(this.config.bottomBox).html(this.$el);
        }

    });

});
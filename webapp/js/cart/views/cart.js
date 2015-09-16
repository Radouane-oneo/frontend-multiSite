define([
    'backbone',
    '../models/cart',
    'text!../templates/cart.html',
    'views/shipping'
], function (Backbone, cartModel, cartTemplate, shippingView) {

    return Backbone.View.extend({
        template: _.template(cartTemplate),
        events: {
        },
        initialize: function() {
            this.config = require("config");
            this.model = new cartModel(this.config.cart);
            this.shippingView = new shippingView(this.model);


        }
        
    });

});
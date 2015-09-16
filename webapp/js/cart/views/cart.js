define([
    'backbone',
    '../models/cart',
    'text!../templates/cart.html',
    'views/shipping',
    'views/jobView'
], function (Backbone, cartModel, cartTemplate, shippingView, jobView) {

    return Backbone.View.extend({
        template: _.template(cartTemplate),
        events: {
        },
        initialize: function() {
            this.config = require("config");
            this.model = new cartModel(this.config.cart);

            //jobView
            this.jobView = new jobView(this.model);

            //shipping View
            this.shippingView = new shippingView(this.model);


        }
        
    });

});
define([
    'backbone',
    '../models/checkout',
    './billing',
    './neutral',
    './shipping',
    './Error',
    'text!../templates/checkout.html'
], function (Backbone, checkoutModel, billingView, neutralView, shippingView, errorView, checkoutTemplate) {

    return Backbone.View.extend({
        template: _.template(checkoutTemplate),
        events: {
        },
        initialize: function() {
            _this = this;
            this.config = require("config");
            this.model = new checkoutModel(this.config);
            this.render();

            
//            //error View
//            this.errorView = new errorView(this.model);
//
//            //job View
//            this.billingView = new billingView(this.model);
//
//            //shipping View
//            this.shippingView = new shippingView(this.model);
//
//            //neutral View
//            this.neutralView = new neutralView(this.model);
            
        },
        render : function(){
            this.setElement(this.template());


            $(this.config.containerId).html(this.$el);
        },
        changeShipping : function(orderItemShipping){
            this.model.set("orderItemShipping", orderItemShipping);
        }
        
    });

});
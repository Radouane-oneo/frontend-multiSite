define([
    'backbone',
    '../models/checkout',
    './billing-detail',
    './billing-edit',
    './neutral',
    './shipping-detail',
    './shipping-edit',
    './Error',
    'text!../templates/checkout.html'
], function (Backbone, checkoutModel, billingDetailView, billingEditView, neutralView, shippingDetailView, shippingEditView, errorView, checkoutTemplate) {


    return Backbone.View.extend({
        template: _.template(checkoutTemplate),
        events: {
        },
        initialize: function() {
            this.config = require("config");
            this.model = new checkoutModel(this.config);
            this.render();

            //billing detail View
            //this.billingDetailView = new billingDetailView(this.model);

            //billing edit View
            //this.billingEditView = new billingEditView(this.model);

            //shipping View
            this.shippingDetailView = new shippingDetailView(this.model);
            this.shippingEditView = new shippingEditView(this.model);

            //neutral View
            //this.neutral = new neutralView(this.model);

            //error View
            this.errorView = new errorView(this.model);
        },
        render : function(){
            this.setElement(this.template());
            $(this.config.containerId).html(this.$el);
        },
        changeShipping : function(orderItemShipping){
            var shippingAddresses = $.extend(true, {}, this.model.get("shippingAddresses"));
            shippingAddresses.orderItemShipping = orderItemShipping;
            this.model.set("shippingAddresses", shippingAddresses);
        }
    });
});
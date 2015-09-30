define([
    'backbone',
    '../models/checkout',
//    './billing',
//    './neutral',
    './shipping-detail',
    './shipping-edit',
//    './Error',
    'text!../templates/checkout.html'
], function (Backbone, checkoutModel, shippingDetailView, shippingEditView ,checkoutTemplate) {

    return Backbone.View.extend({
        template: _.template(checkoutTemplate),
        events: {
        },
        initialize: function() {
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
              this.shippingDetailView = new shippingDetailView(this.model);
              this.shippingEditView = new shippingEditView(this.model);
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
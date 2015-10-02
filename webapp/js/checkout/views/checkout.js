define([
    'backbone',
    '../models/checkout',
    './billing-detail',
    './billing-edit',
    './neutral',
    'text!../templates/checkout.html'
], function (Backbone, checkoutModel, billingDetailView, billingEditView, neutralView, checkoutTemplate) {

    return Backbone.View.extend({
        template: _.template(checkoutTemplate),
        events: {
        },
        initialize: function() {
            _this = this;
            this.config = require("config");
            this.model = new checkoutModel(this.config);
            this.render();

            //billing detail View
            this.billingDetailView = new billingDetailView(this.model);
            
            //billing Edit View
            this.billingEditView = new billingEditView(this.model);
            //neutral View
            this.neutral = new neutralView(this.model);
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
define([
    'backbone',
    'text!../templates/billing-detail.html',
    'views/Error'
], function (Backbone, billingDetailTemplate, errorView) {

    return Backbone.View.extend({
        template: _.template(billingDetailTemplate),
        events: {
            "click #toggle-invoice-form" :"displayBillingForm"
        },
        initialize: function(model) {
            _this = this;
            this.config = require("config");
            this.model = model;
            this.render();
            this.model.on("change",this.render, this);
        },
        render : function(){
            this.setElement(this.template({
                "model" : this.model.toJSON()
            }));

            $(this.config.detailBox).find(".billingBox").html(this.$el);
        },
        displayBillingForm: function(){
            myCheckout.shippingEditView.$el.hide();
            myCheckout.billingEditView.$el.show();
        }
    });
});
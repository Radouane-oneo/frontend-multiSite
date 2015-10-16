define([
    'backbone',
    'text!../templates/neutral.html',
    '../helpers/ajaxCaller'
], function (Backbone, neutralTemplate, ajaxCaller) {

    return Backbone.View.extend({
        template: _.template(neutralTemplate),
        events: {
            "change #neutralRadioClick" : "neutralOption",
            "click #processPayment" : "processPayment"
        },
        initialize: function(model) {
            this.config = require("config");
            this.model = model;
            this.render();
        },
        render: function(){
            this.setElement(this.template({
                "model" : this.model.toJSON()
            }));
            $(this.config.neutralBox).append(this.$el);
        },
        neutralOption : function(e){
            var elmTarget = $(e.currentTarget);
            ajaxCaller.call("saveNeutralShipping",
            {'neutral' : elmTarget.is(':checked')}
            ).done(function(result) {
                
            });
        },
        processPayment : function(e){
            var billingError = myCheckout.billingEditView.errors(true);
            var shippingError = myCheckout.shippingEditView.errors(true);
            var shippingDetailError = myCheckout.shippingDetailView.errors();
            if(billingError) {
                myCheckout.errorView.render(billingError);
                $(window).scrollTop($(this.config.containerId).offset().top);
                return false;
            }
            if(shippingError) {
                myCheckout.errorView.render(shippingError);
                $(window).scrollTop($(this.config.containerId).offset().top);
                return false;
            }
            if(shippingDetailError) {
                myCheckout.errorView.render(shippingDetailError);
                $(window).scrollTop($(this.config.containerId).offset().top);
                return false;
            }
            if(myCheckout.disable) return false;
	     
	    myCheckout.billingEditView.saveBA();
            $("#pccheckout-invoiceanddelivery-form").submit();
        }
    });
});

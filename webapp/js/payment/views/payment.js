define([
    'backbone',
    '../models/payment',
    'text!../templates/payment.html',
    'views/methodePayment',
    'views/detailCommande',
    'views/conditionGeneral',
    'views/priceBlock',
    'views/Error',
    'text!../templates/paymentTemplateAccessDenied.html',
], function (Backbone, paymentModel, paymentTemplate, methodePayment, detailCommande, conditionGeneral, priceBlock, errorView, paymentTemplateAccessDenied) {

    return Backbone.View.extend({
        template: _.template(paymentTemplate),
        templateAccessDenied: _.template(paymentTemplateAccessDenied),
        events: {
        },
        initialize: function() {
            _this = this;
            this.config = require("config");
            this.model = new paymentModel(this.config.cart);
            this.render();
            this.errorView = new errorView(this.model);
            this.methodePayment = new methodePayment(this.model);
            this.detailCommande = new detailCommande(this.model);
            this.conditionGeneral = new conditionGeneral(this.model);
            this.priceBlock = new priceBlock(this.model);
            clearInterval(timerSaveP);
            $("#save-progress-bar").find("div").stop(true).animate({width: 100 + '%'},1000, function(){
                $('#box-progress').hide();
            });
        },
        render : function(){
            console.log(this.model.toJSON());
            this.setElement(this.template({
                "model" : this.model.toJSON(),
                "config" : this.config
            }));
            if ((this.model.get("orderItems") == '') ||
                (!this.model.get("orderItemShipping").orderShippingAddress) || 
                (!this.model.get("orderItemShipping").orderShippingAddress.id)||
                (!this.model.get("billingAccount"))){
                this.setElement(this.templateAccessDenied({
                    "config" : this.config
                }));
            }
            $(this.config.containerId).html(this.$el);
        },   
        errors : function(){
            if(!this.model.get("paymentId"))
                return this.config.labels['methodePaymentNull'];
            return false;
        }
    });
});
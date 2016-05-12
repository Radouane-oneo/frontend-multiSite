define([
    'backbone',
    'text!../templates/priceBlock.html',
    'text!../templates/price.html'
], function (Backbone, priceBlockTemplate, priceTemplate) {

    return Backbone.View.extend({
        template: _.template(priceBlockTemplate),
        events: {
            "click #actionPayment" : "actionPayment"
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
                "config" : this.config,
                "subTotalAmount" : this.model.subTotalAmount(),
                "priceTpl" : _.template(priceTemplate)
            }));

            $(this.config.containerId).find("#priceBlock").html(this.$el);
            var taginternalName = $('.form-item-payment-method-table input[name="paymentMethod"]:checked').attr('tag-internalName');
            switch(taginternalName){
                case "visa":  $(this.config.containerId).find("#priceBlock #actionPayment").val(this.config.labels['paynow']);break;
                case "Bancontact": $(this.config.containerId).find("#priceBlock #actionPayment").val(this.config.labels['paylater']);break;
                case "transfer": $(this.config.containerId).find("#priceBlock #actionPayment").val(this.config.labels['paylater']);break;
                case "mastercard": $(this.config.containerId).find("#priceBlock #actionPayment").val(this.config.labels['paynow']);break;
                case "paypal": $(this.config.containerId).find("#priceBlock #actionPayment").val(this.config.labels['paynow']);break;
            }
        },
        actionPayment : function(){
            if(!this.model.get("paymentId")){                
                myPayment.errorView.render(this.config.labels['methodePaymentNull']);
                $(window).scrollTop($(this.config.containerId).offset().top);
                return false;
            }
            if(!($('#edit-agree').is(':checked'))) {
                //console.log('non');
                myPayment.errorView.render(this.config.labels['agreeMessage']);
                $(window).scrollTop($(this.config.containerId).offset().top);
                return false;
            }
            else{
                if(myPayment.disable) return false;
                location.href = "/" + this.config.prefix + "/payment/ajax/submitpayment/"+this.model.get("paymentId")+"/"+this.model.get("id")+"/"+this.model.get("totalAmount");               
            }   
            
        }
    });
});
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
        },
        actionPayment : function(){
            if(!($('#edit-agree').is(':checked'))) {
                console.log('non');
                myPayment.errorView.render(this.config.labels['agreeMessage']);
                $(window).scrollTop($(this.config.containerId).offset().top);
                return false;
            }
            else{
                myPayment.errorView.render();
               
            }   
            console.log(this.model.get("paymentId"));
            if(!this.model.get("paymentId")){
                
                myPayment.errorView.render(this.config.labels['methodePaymentNull']);
                $(window).scrollTop($(this.config.containerId).offset().top);
                return false;
            }
            return true;
           
            if(myPayment.disable) return false;
            location.href = "/" + this.config.prefix + "/checkout";

        }

    });

});
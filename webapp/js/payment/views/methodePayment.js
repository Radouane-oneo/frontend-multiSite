define([
    'backbone',
    'text!../templates/methodePayment.html',
    'text!../templates/price.html',
    '../helpers/ajaxCaller'
], function (Backbone, methodePayment, priceTemplate, ajaxCaller) {

    return Backbone.View.extend({
        template: _.template(methodePayment),
        events: {
            "change input[name='paymentMethod']" : "saveMethodPayment",
            "click .payment-methods-table tr" : "checkInputMethodPayment",
            "click input[name='paymentMethod']" : "stopPropagation"
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
               "priceTpl" : _.template(priceTemplate)
            }));
            $(this.config.containerId).find("#methodePayment").html(this.$el); 
            this.changePayementMethodImg();        
        },
        checkInputMethodPayment : function(e){
            $(e.currentTarget).find('input').attr('checked','checked');
            $(e.currentTarget).find('input').change();
        },
        saveMethodPayment : function(e){
            var me = this;
             me.model.set({
                        "paymentTag" : $(e.currentTarget).attr("tag-id"),
                        "paymentDescription" : $(e.currentTarget).attr("tagdesc-id"),
                        "paymentPrice" : $(e.currentTarget).attr("price-id"),
                        "paymentId" : $(e.currentTarget).val()
                    });
                    $(".textpayment").html('<p>'+ $(e.currentTarget).attr("tagdesc-id")+'</p>');
            ajaxCaller.call("saveMethodPayment",{},"GET",$(e.currentTarget).val()).done(function(resultData){
              
                if(resultData.code == "200"){
                    me.model.set({
                        "subTotalAmount" : resultData.data.subTotalAmount,
                        "totalAmount" : resultData.data.totalAmount
                    });
                    $(".textpayment").html('<p>'+ $(e.currentTarget).attr("tagdesc-id")+'</p>').show();
                }
            });
            
            e.preventDefault();
            e.stopPropagation();
        },
        stopPropagation : function(e){
            e.stopPropagation();
        },

        changePayementMethodImg : function () {
            var lang = this.config.prefix;

            switch (lang) {
                case "benl": $('#edit-payment-method-text.imgpayment').css('background-image' , "url('https://s3-eu-west-1.amazonaws.com/pc-images/images.flyer.eu/payment_be.jpg')");
                break;
                case "befr" : $('#edit-payment-method-text.imgpayment').css('background-image' , "url('https://s3-eu-west-1.amazonaws.com/pc-images/images.flyer.eu/payment_be.jpg')");
                break;
                case "nlnl" : $('#edit-payment-method-text.imgpayment').css('background-image' , "url('https://s3-eu-west-1.amazonaws.com/pc-images/images.flyer.eu/payment_nl.jpg')");
                break;
                case "frfr" : $('#edit-payment-method-text.imgpayment').css('background-image' , "url('https://s3-eu-west-1.amazonaws.com/pc-images/images.flyer.eu/payment_fr.jpg')");
                break;
                case "lufr" : $('#edit-payment-method-text.imgpayment').css('background-image' , "url('https://s3-eu-west-1.amazonaws.com/pc-images/images.flyer.eu/payment_lu.jpg')");
            }
        }
    });

});
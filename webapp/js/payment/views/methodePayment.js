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
        }
    });

});
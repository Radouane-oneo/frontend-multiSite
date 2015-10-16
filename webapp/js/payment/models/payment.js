define([
    'backbone'
], function (Backbone) {

    return Backbone.Model.extend({
        defaults: function() {
                this.config = require("config");
                  var paymentTag = '';
                  var paymentPrice = 0;
                  var paymentId = 0;
                _.each(this.config.cart.orderItemsPayment, function(payment) {
                    paymentTag = payment.description;
                    paymentPrice = payment.price;
                    paymentId = payment.paymentMethodResellerShop;
                });
            return {
                "MethodPayment" : 0,
                "descriptionTagPayment" : null,
                "subTotalAmount" : 0,
                "totalAmount" : 0,
                "paymentTag" : paymentTag,
                "paymentDescription" : null,
                "paymentPrice" : paymentPrice,
                "price" : 0,
                "paymentId" : paymentId
            }
        },
        initialize: function() {
        },
        subTotalAmount: function() {
            var subTotalAmount = 0;
            _.each(this.get("orderItems"), function(orderItem){
                subTotalAmount += parseFloat(orderItem.price);
                _.each(orderItem.options, function(option){
                    subTotalAmount += parseFloat(option.price);
                });
                _.each(orderItem.fotoliaItems, function(fotoliaItem){
                    subTotalAmount += parseFloat(fotoliaItem.price);
                });
                if(orderItem.fileCheck.price)
                    subTotalAmount += parseFloat(orderItem.fileCheck.price);
            });
            _.each(this.get("discountItems"), function(discountItem){
                subTotalAmount += parseFloat(discountItem.price);
            });
            if(this.get("orderItemShipping").price)
                subTotalAmount += parseFloat(this.get("orderItemShipping").price);
            return subTotalAmount;
        }
    });

});
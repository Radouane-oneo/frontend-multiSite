define([
    'backbone'
], function (Backbone, cart) {

    return Backbone.Model.extend({
        defaults: function() {
            //this.config = require("config");
            return {
               
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
                
                if(orderItem.designTemplate.price)
                    subTotalAmount += parseFloat(orderItem.designTemplate.price);
            });
            _.each(this.get("discountItems"), function(discountItem){
                subTotalAmount += parseFloat(discountItem.price);
            });
            if(this.get("orderItemShipping") != null && this.get("orderItemShipping").price)
                subTotalAmount += parseFloat(this.get("orderItemShipping").price);
            return subTotalAmount;
        }
    });

});
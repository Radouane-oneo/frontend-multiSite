define([
    'backbone'
], function (Backbone) {

    return Backbone.Model.extend({
        defaults: function() {
            this.config = require("config");
            return {
                "toolBoxGroup" : this.config.toolBoxGroups["defaultGroup"],
                "priceGroupId" : this.config.toolBoxGroups["defaultGroup"]["priceGroupId"],
                "options" : [],
                "quantity" : this.getDefaultQuantity(),
                "price" : this.getDefaultPrice()
            }
        },
        initialize: function() {

        },
        getDefaultQuantity: function(){
            var defaultPricing = _.findWhere(this.config.toolBoxGroups["defaultGroup"]["pricing"], {defaultPricing: true});
            if(!defaultPricing)
                defaultPricing = _.toArray(this.config.toolBoxGroups["defaultGroup"]["pricing"])[0];
            return defaultPricing.quantity;
        },
        getDefaultPrice: function(){
            var defaultPricing = _.findWhere(this.config.toolBoxGroups["defaultGroup"]["pricing"], {defaultPricing: true});
            if(!defaultPricing)
                defaultPricing = _.toArray(this.config.toolBoxGroups["defaultGroup"]["pricing"])[0];
            return ((defaultPricing["promoPrice"]) ? defaultPricing["promoPrice"] : defaultPricing["sellPrice"]);
        },
        priceOption: function(option){
            var result = option["startSell"];
            var step = option["unit"];
            var i = 0;
            do {
                result += option["unitSell"];
                i += step;
            } while (i < this.model.quantity);
            return result.toFixed(2);
        },
        totalPrice: function(){
            var me = this;
            var totalPrice = this.model.price;
            var options = _.filter(this.model.toolBoxGroup.options, function(option){ return $.inArray(option.id, me.model.options)!=-1 });
            _.each(options,function(option){
                totalPrice += parseFloat(me.priceOption(option));
            });
            return totalPrice.toFixed(2);
        }
    });

});
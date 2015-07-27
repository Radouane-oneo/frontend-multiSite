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
                "quantity" : this.getDefaultQuantity(null),
                "price" : this.getDefaultPrice(null),
                "widthCF" : null,
                "heightCF" : null,
                "CF" : null
            }
        },
        initialize: function() {
            if(this.config.defaultQuantity)
                this.set("quantity", this.config.defaultQuantity);
            if(this.config.defaultOptions)
                this.set("options", this.config.defaultOptions);
            if(this.config.defaultItems) {
                this.setToolBoxGroup(this.config.defaultItems);
                if(!this.config.defaultQuantity) {
                    this.set({
                        "quantity" : this.getDefaultQuantity(this.get("toolBoxGroup")),
                        "price" : this.getDefaultPrice(this.get("toolBoxGroup"))
                    });
                }
            }
        },
        getDefaultQuantity: function(toolBoxGroup){
            toolBoxGroup = (toolBoxGroup) ? toolBoxGroup : this.config.toolBoxGroups["defaultGroup"];
            var defaultPricing = _.findWhere(toolBoxGroup["pricing"], {defaultPricing: true});
            if(!defaultPricing)
                defaultPricing = _.toArray(toolBoxGroup["pricing"])[0];
            return defaultPricing.quantity;
        },
        getDefaultPrice: function(toolBoxGroup){
            toolBoxGroup = (toolBoxGroup) ? toolBoxGroup : this.config.toolBoxGroups["defaultGroup"];
            var defaultPricing = _.findWhere(toolBoxGroup["pricing"], {defaultPricing: true});
            if(!defaultPricing)
                defaultPricing = _.toArray(toolBoxGroup["pricing"])[0];
            return ((defaultPricing["promoPrice"]) ? defaultPricing["promoPrice"] : defaultPricing["sellPrice"]);
        },
        priceOption: function(option){
            var result = option["startSell"];
            var step = option["unit"];
            var coefficient = parseInt(this.model.quantity / step);
            var modulo = this.model.quantity % step;
            coefficient = (modulo==0) ? coefficient : (coefficient +1);
            result = result + (coefficient * option["unitSell"]);
            return Math.round(result*100)/100;
        },
        totalPrice: function(){
            var me = this;

            var totalPrice = this.model.price;
            var options = _.filter(this.model.toolBoxGroup.options, function(option){ return $.inArray(option.id, me.model.options)!=-1 });
            _.each(options,function(option){
                totalPrice += parseFloat(me.priceOption(option));
            });

            return Math.round(totalPrice*100)/100;
        },
        setToolBoxGroup: function(items){
            var me = this;
            var toolBoxGroup = undefined;
            while(typeof toolBoxGroup == "undefined"){
                toolBoxGroup = _.find(this.config.toolBoxGroups, function(t){ return me.containsArray(t['toolboxItems'], items); });
                items.pop();
            }

            this.set({"toolBoxGroup" : toolBoxGroup},{silent : true});

            var pricing = toolBoxGroup["pricing"][this.get("quantity")];
            var price = null;
            var customHeight = this.get('heightCF');
            var customWidth  = this.get('widthCF');
            if(pricing && !(customHeight) && !(customWidth)){
                price = (pricing["promoPrice"]) ? pricing["promoPrice"] : pricing["sellPrice"];
            } else {
                price = this.calculatePrice(this.get("quantity"));
            }

            var allOptions = [];
            _.each(toolBoxGroup["options"],function(option){
                allOptions.push(option.id);
            });

            var validOptions = _.intersection(allOptions, this.get("options"));

            this.set({
                "priceGroupId" : toolBoxGroup["priceGroupId"],
                "options" : validOptions,
                "price" : price
            })
        },
        containsArray: function(arrParent, arrChild){
            for(var i in arrChild) {
                if($.inArray(arrChild[i], arrParent)==-1)
                    return false;
            }
            return true;
        },
        calculatePrice: function(quantity) {
            var customHeight = this.get('heightCF');
            var customWidth  = this.get('widthCF');
            if((customHeight) && (customWidth)){
                var price = ((customHeight * customWidth * _.toArray(this.get("toolBoxGroup")["pricing"])[0]["sellPrice"]) / (1 * 1000 * 1000)) * quantity;
                console.log('price: '+price+ 'quantity' + quantity);
                return price;
            }
            var betweenPrice, betweenBlock, previousQuantity, previousPrice, nextQuantityPrice, price, diff, multiplyUnit;

            for(var i in this.get("toolBoxGroup")["pricing"]){
                price = this.get("toolBoxGroup")["pricing"][i];
                if (price["quantity"] < quantity) {
                    betweenPrice = price["betweenSellPrice"];
                    betweenBlock = price["betweenBlock"];
                    previousQuantity = price["quantity"];
                    previousPrice = price["sellPrice"];
                    continue;
                }
                nextQuantityPrice = price["sellPrice"];
                break;
            }

            if (betweenPrice && betweenBlock) {
                // Get between price per block
                diff = quantity - previousQuantity;
                if (diff % betweenBlock) {
                    // Given quantity is not dividable by betweenBlock
                    multiplyUnit = ((diff - (diff % betweenBlock)) / betweenBlock) + 1;
                } else {
                    // Add previous price to between price
                    multiplyUnit = diff / betweenBlock;
                }

                return previousPrice + (betweenPrice * multiplyUnit);
            }
            // No between price, get price of next quantity
            if (nextQuantityPrice) {
                return nextQuantityPrice;
            }

            return previousPrice;

        }
    });

});
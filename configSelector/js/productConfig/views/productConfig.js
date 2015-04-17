define([
    'backbone',
    'text!../templates/' + require("config").themeFile,
    '../models/productConfig',
    'text!../templates/price.html'
], function (Backbone, productConfigTemplate, productConfigModel, priceTemplate) {

    return Backbone.View.extend({
        template: _.template(productConfigTemplate),
        events: {
            "click .form-type-select" : "toggleExpand",
            "click .form-type-checkboxes" : "toggleExpand",
            "click .dropdown a" : "changeToolBoxGroup",
            "change #edit-options input.form-checkbox" : "changeOptions",
            "change #prices-table input.form-radio" : "changeQuantity",
            "click #prices-table tbody tr:not(.custom)" : "selectInput",
            "click #edit-calculer" : "calculatePrice"
        },
        initialize: function() {
            this.config = require("config");
            this.model = new productConfigModel();
            this.render();
            this.model.on("change",this.render,this);
        },
        render:function(){
            this.setElement(this.template({
                "model" : this.model.toJSON(),
                "config" : this.config,
                "priceOption" : this.model.priceOption,
                "totalPrice" : this.model.totalPrice,
                "priceTpl" : _.template(priceTemplate)
            }));
            $(this.config.containerId).html(this.$el);
            console.log(this.model.toJSON());
        },
        toggleExpand: function(e){
            $(e.currentTarget).toggleClass("expanded");
            $(e.currentTarget).next().slideToggle();
        },
        changeToolBoxGroup: function(e){
            var selectEl = $(e.currentTarget).parents(".dropdown").prev();
            var oldSelectedValue = selectEl.find("div.selected-item").attr("data-id");
            var selectedItems = [];
            selectEl.click();

            this.$("div.selected-item").each(function(){
                var selectedItem = ($(this).attr("data-id")==oldSelectedValue) ? $(e.currentTarget).attr("id") : $(this).attr("data-id");
                selectedItems.push(parseInt(selectedItem));
            });

            this.model.setToolBoxGroup(selectedItems);

            e.preventDefault();
        },
        changeOptions: function(e){
            var selectEl = $(e.target).parents(".form-checkboxes").prev();
            var options = [];
            selectEl.click();

            $("#edit-options").find("input.form-checkbox:checked").each(function(){
                options.push(parseInt($(this).val()));
            });

            this.model.set("options", options);
        },
        changeQuantity: function(e){
            var quantity = parseInt($(e.target).val());
            var pricing = this.model.get("toolBoxGroup")["pricing"][quantity];
            var price = (pricing["promoPrice"]) ? pricing["promoPrice"] : pricing["sellPrice"];
            this.model.set({
                "price" : price,
                "quantity" : quantity
            });
        },
        selectInput: function(e){
            $(e.currentTarget).find("input.form-radio").attr("checked","checked");
            $(e.currentTarget).find("input.form-radio").change();
        },
        calculatePrice: function(){
            var quantity = parseInt(this.$("#edit-custom").val());
            var pricing = this.model.get("toolBoxGroup")["pricing"][quantity];
            var price = null;
            if(pricing){
                price = (pricing["promoPrice"]) ? pricing["promoPrice"] : pricing["sellPrice"];
            } else {
                price = this.model.calculatePrice(quantity);
            }
            this.model.set({
                "price" : price,
                "quantity" : quantity
            });
            return false;
        }
    });

});
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
            "click #edit-calculer" : "calculatePrice",
            "keypress #edit-custom" : "checkQuantity",
            "click #deadlinestooltip legend" : "toggleCollapse",
            "click #deadlinestooltip legend a" : "preventDefault",
            "focus #edit-custom" : "editCustomQuantity"
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
                "priceTpl" : _.template(priceTemplate),
                "shippingHTML" : this.$("#bloc-shipping").html(),
                "customQuantity" : !(this.model.get("toolBoxGroup")["pricing"][this.model.get("quantity")]),
                "expandedOptions" : this.$("#edit-options").is(":visible")
            }));
            $(this.config.containerId).html(this.$el);

            this.$("#bloc-shipping").load("/getshippingdate #edit-shipping", {
                "productId" : this.config.labels['productId'],
                "items" : this.model.get("toolBoxGroup")["toolboxItems"],
                "options" : this.model.get("options"),
                "quantity" : this.model.get("quantity")
            });
        },
        toggleExpand: function(e){
            $(e.currentTarget).toggleClass("expanded");
            $(e.currentTarget).next().slideToggle();
        },
        toggleCollapse: function(e){
            var fieldSet = $(e.currentTarget).parents("#deadlinestooltip");
            if(fieldSet.hasClass("collapsed")) {
                fieldSet.removeClass("collapsed");
                $(e.currentTarget).next().hide();
                $(e.currentTarget).next().slideToggle();
            } else {
                $(e.currentTarget).next().slideToggle().promise().done(function(){
                    fieldSet.addClass("collapsed");
                });
            }
        },
        preventDefault: function(e){
            e.preventDefault();
        },
        changeToolBoxGroup: function(e){
            var dropDown = $(e.currentTarget).parents(".dropdown");
            var selectEl = dropDown.prev();
            var oldSelectedValue = selectEl.find("div.selected-item").attr("data-id");
            var selectedItems = [];
            var me = this;
            selectEl.click();

            this.$("div.selected-item").each(function(){
                var selectedItem = ($(this).attr("data-id")==oldSelectedValue) ? $(e.currentTarget).attr("id") : $(this).attr("data-id");
                selectedItems.push(parseInt(selectedItem));
            });

            dropDown.promise().done(function(){
                me.model.setToolBoxGroup(selectedItems);
                $(window).scrollTop(me.$(".form-type-select").offset().top);
            });

            e.preventDefault();
        },
        changeOptions: function(){
            var options = [];
            var me = this;

            $("#edit-options").find("input.form-checkbox:checked").each(function(){
                options.push(parseInt($(this).val()));
            });

            me.model.set("options", options);
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
            if(isNaN(quantity)) return false;
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
        },
        checkQuantity: function(e){
            if(e.which != 8 && isNaN(String.fromCharCode(e.which)))
                e.preventDefault();
        },
        editCustomQuantity: function(){
            $("#edit-quantity-custom").attr("checked", "checked");
        },
    });

});
define([
    'backbone',
    'text!../templates/discountCode.html',
    'text!../templates/price.html',
    '../helpers/ajaxCaller'
], function (Backbone, discountTemplate, priceTemplate, ajaxCaller) {

    return Backbone.View.extend({
        template: _.template(discountTemplate),
        events: {
            "click #delete-discount" : "deleteDiscount",
            "click #edit-cart-discount-add" : "addDiscount"
        },
        initialize: function(model) {
            this.config = require("config");
            this.model = model;
            this.render();
            this.model.on("change",this.render,this);
        },
        render: function(){
            this.setElement(this.template({
                "model" : this.model.toJSON(),
                "config" : this.config,
                "priceTpl" : _.template(priceTemplate)
            }));

            $(this.config.bottomBox).append(this.$el);
        },
        deleteDiscount: function(e){
            var me = this;

            if(this.model.get("discountItems").length == 1)
                $(e.currentTarget).parents(".jsDiscount").remove();
            else
                $(e.currentTarget).parents(".discount-code-wrapper").remove();

            ajaxCaller.call("deleteDiscount",{
                code : $(e.currentTarget).attr("data-code")
            }).done(function(resultData){
                if(resultData.code == "200")
                    me.model.set("discountItems", resultData.data.discountItems);
            });
            e.preventDefault();
        },
        addDiscount: function(e){
            if(!this.config.isConnected) {
                myCart.errorView.render(this.config.labels['mustConnectedError']);
                $(window).scrollTop($(this.config.containerId).offset().top);
                return false;
            }
            var me = this;
            ajaxCaller.call("addDiscount",{
                code : this.$("#edit-cart-discount-code").val()
            }).done(function(resultData){
                 if(resultData.code == "200")
                    me.model.set("discountItems", resultData.data.discountItems);
                 else {
                     myCart.errorView.render(me.config.labels['invalidDiscountCode']);
                     $(window).scrollTop($(me.config.containerId).offset().top);
                 }

            });
            e.preventDefault();
        }

    });

});
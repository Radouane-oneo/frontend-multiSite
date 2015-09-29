define([
    'backbone',
    'text!../templates/shipping.html',
    'text!../templates/price.html',
    '../helpers/ajaxCaller'
], function (Backbone, shippingTemplate, priceTemplate, ajaxCaller) {

    return Backbone.View.extend({
        template: _.template(shippingTemplate),
        events: {
            "change input[name='shipping-type']" : "changeShipping",
            "click .shipp-item" : "selectShipping",
            "click .pcflyerstores-picker-link,.pcbpost-picker-link" : "stopPropagation"
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

            $(this.config.bottomBox).html(this.$el);

            $('.pcflyerstores-picker-link, .pcbpost-picker-link').fancybox({
                width: 993,
                height: 500,
                padding: 0,
                margin: 0,
                scrolling: false,
                autoScale: false,
                hideOnOverlayClick: false,
                autoDimensions: false
            });
        },
        changeShipping : function(e){
            var me = this;
            ajaxCaller.call("changeShipping",{},"GET",$(e.currentTarget).val()).done(function(resultData){
                if(resultData.code == "200")
                    me.model.set({"orderItemShipping": resultData.data.orderItemShipping, "discountItems": resultData.data.discountItems});
            });
            e.preventDefault();
        },
        selectShipping : function(e){
            $(e.currentTarget).find(".form-radio").attr("checked", "checked");
            $(e.currentTarget).find(".form-radio").change();
        },
        stopPropagation : function(e){
            //e.stopPropagation();
        },
        errors : function(){
            if(!this.model.get("orderItemShipping").id)
                return this.config.labels['shippingNotNullError'];
            return false;
        }

    });

});
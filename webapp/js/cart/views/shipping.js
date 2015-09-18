define([
    'backbone',
    'text!../templates/shipping.html',
    'text!../templates/price.html',
    '../helpers/ajaxCaller'
], function (Backbone, shippingTemplate, priceTemplate, ajaxCaller) {

    return Backbone.View.extend({
        template: _.template(shippingTemplate),
        events: {
            "change input[name='shipping-type']" : "changeShipping"
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
        },
        changeShipping : function(e){
            var me = this;
            ajaxCaller.call("changeShipping",{
                id : $(e.currentTarget).val()
            }).done(function(orderItemShipping){
                me.model.set("orderItemShipping", orderItemShipping);
            });
            e.preventDefault();
        }

    });

});
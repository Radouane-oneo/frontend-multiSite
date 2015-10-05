define([
    'backbone',
    'text!../templates/shipping-detail.html',
    'text!../templates/shipping-detail-pickup.html',
    '../helpers/ajaxCaller'
], function (Backbone, shippingDetailTemplate, shippingDetailPickupTemplate, ajaxCaller) {

    return Backbone.View.extend({
        template: _.template(shippingDetailTemplate),
        events: {
        },
        initialize: function(model) {
            this.config = require("config");
            this.model = model;
            if (this.model.get("shippingAddresses").orderItemShipping && this.model.get("shippingAddresses").orderItemShipping['deliveryType'] != "deliveryTypeDeliver")
                this.template = _.template(shippingDetailPickupTemplate);
            this.render();
            this.model.on("change",this.render,this);
        },
        render:function(){
            this.setElement(this.template({
                "model" : this.model.toJSON()
            }));

            $(this.config.detailBox).find(".shippingBox").html(this.$el);

        },
        errors : function(){
            return false;
        }

    });

});
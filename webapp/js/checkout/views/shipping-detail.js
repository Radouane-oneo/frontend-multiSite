define([
    'backbone',
    'text!../templates/shipping-detail.html',
    'text!../templates/shipping-detail-pickup.html',
    '../helpers/ajaxCaller'
], function (Backbone, shippingDetailTemplate, shippingDetailPickupTemplate, ajaxCaller) {

    return Backbone.View.extend({
        template: _.template(shippingDetailTemplate),
        events: {
            "click #toggle-shipping-form" : "displayShippingForm",
            "blur #edit-shipping-detail-contact" : "changeName"
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
        displayShippingForm: function(){
            myCheckout.billingEditView.$el.hide();
            myCheckout.shippingEditView.$el.toggle();
            myCheckout.shippingEditView.initMap();

            if(this.model.get("shippingAddresses").orderItemShipping.orderShippingAddress) {
                var customerAddressId = this.model.get("shippingAddresses").orderItemShipping.orderShippingAddress.shippingAddress;
                $("#edit-shipping-detail-current-select").val(customerAddressId);
                $("#edit-shipping-detail-current-select").change();
            }
        },
        changeName: function(e){
            var shippingAddresses = $.extend(true, {}, this.model.get("shippingAddresses"));
            shippingAddresses.orderItemShipping.orderShippingAddress.name = $(e.currentTarget).val();
            this.model.set({"shippingAddresses": shippingAddresses},{silent: true});
        },
        errors : function(){
            this.$("input#edit-shipping-detail-contact").css("border-color","");
            if(this.$("input#edit-shipping-detail-contact").val() == "") {
                this.$("input#edit-shipping-detail-contact").css("border-color","red");
                return this.config.labels["nameEmptyError"];
            }

            return false;
        }

    });

});
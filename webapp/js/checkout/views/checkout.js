define([
    'backbone',
    '../models/checkout',
    './billing-detail',
    './billing-edit',
    './neutral',
    './shipping-detail',
    './shipping-edit',
    './Error',
    'text!../templates/checkout.html'
], function (Backbone, checkoutModel, billingDetailView, billingEditView, neutralView, shippingDetailView, shippingEditView, errorView, checkoutTemplate) {


    return Backbone.View.extend({
        template: _.template(checkoutTemplate),
        events: {
        },
        initialize: function() {
            this.config = require("config");
            this.model = new checkoutModel(this.config);
            this.render();

            //billing detail View
            this.billingDetailView = new billingDetailView(this.model);

            //billing edit View
            this.billingEditView = new billingEditView(this.model);

            //shipping View
            this.shippingDetailView = new shippingDetailView(this.model);
            this.shippingEditView = new shippingEditView(this.model);

            //neutral View
            this.neutral = new neutralView(this.model);

            //error View
            this.errorView = new errorView(this.model);

            clearInterval(timerSaveP);
            $("#save-progress-bar").find("div").stop(true).animate({width: 100 + '%'},1000, function(){
                $('#box-progress').hide();
            });
        },
        render : function(){
            this.setElement(this.template({
                "model" : this.model.toJSON()
            }));
            $(this.config.containerId).html(this.$el);
            this.HeightSame('wrap_detail');
            this.HeightSame('fieldset-sameheight');
        },
        changeShipping : function(orderItemShipping){
            var shippingAddresses = $.extend(true, {}, this.model.get("shippingAddresses"));
            shippingAddresses.orderItemShipping = orderItemShipping;
            this.model.set("shippingAddresses", shippingAddresses);
        },
        HeightSame: function(className){
            setTimeout(function(){
                var liMaxHeight1 = -1;             
                $("div."+className).each(function(index) {
                    if ($(this).outerHeight() > liMaxHeight1) {
                        liMaxHeight1 = $(this).outerHeight(); 
                    }
                });
                $("div."+className).css("height",liMaxHeight1);
            }, 2000);
            
   

        }










    });
});
define([
    'backbone',
    'text!../templates/priceBlock.html',
    'text!../templates/price.html'
], function (Backbone, priceBlockTemplate, priceTemplate) {

    return Backbone.View.extend({
        template: _.template(priceBlockTemplate),
        events: {
            "click #edit-actions-checkout" : "stepCheckout"
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
                "subTotalAmount" : this.model.subTotalAmount(),
                "priceTpl" : _.template(priceTemplate)
            }));

            $(this.config.bottomBox).append(this.$el);
        },
        stepCheckout : function(){
            var jobsError = myCart.jobView.errors();
            var shippingError = myCart.shippingView.errors();
            var salesIdError = myCart.salesIdView.errors();
            if(jobsError) {
                myCart.errorView.render(jobsError);
                $(window).scrollTop($(this.config.containerId).offset().top);
                return false;
            }
            if(shippingError) {
                myCart.errorView.render(shippingError);
                $(window).scrollTop($(this.config.containerId).offset().top);
                return false;
            }
            console.log(salesIdError);
            if(salesIdError){
                console.log(salesIdError);
                return false;
            }
            if(myCart.disable) return false;
            location.href = "/" + this.config.prefix + "/checkout";

        }

    });

});
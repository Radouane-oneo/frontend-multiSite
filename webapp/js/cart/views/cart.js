define([
    'backbone',
    '../models/cart',
    'text!../templates/cart.html',
    'views/shipping',
    'views/jobView',
    'views/discountCode',
    'views/customerReference',
    'views/priceBlock'
], function (Backbone, cartModel, cartTemplate, shippingView, jobView, discountView, customerReferenceView, priceBlockView) {

    return Backbone.View.extend({
        template: _.template(cartTemplate),
        events: {
        },
        initialize: function() {
            _this = this;
            this.config = require("config");
            this.model = new cartModel(this.config.cart);
            this.render();

            //job View
            this.jobView = new jobView(this.model);
           
            //shipping View
            this.shippingView = new shippingView(this.model);

            //discount View
            this.discountView = new discountView(this.model);

            //customerReference View
            this.customerReferenceView = new customerReferenceView(this.model);

            //priceBlock View
            this.priceBlockView = new priceBlockView(this.model);
        },
        render : function(){
            this.setElement(this.template({
                "model" : this.model.toJSON(),
                "config" : this.config
            }));


            $(this.config.containerId).html(this.$el);
        },
        changeShipping : function(orderItemShipping){
            this.model.set("orderItemShipping", orderItemShipping);
        }
        
    });

});
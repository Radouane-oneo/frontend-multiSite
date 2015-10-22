define([
    'backbone',
    '../models/cart',
    'text!../templates/cart.html',
    'views/shipping',
    'views/jobView',
    'views/discountCode',
    'views/customerReference',
    'views/priceBlock',
    'views/Error'
], function (Backbone, cartModel, cartTemplate, shippingView, jobView, discountView, customerReferenceView, priceBlockView, errorView) {

    return Backbone.View.extend({
        template: _.template(cartTemplate),
        events: {
        },
        initialize: function() {
            _this = this;
            this.config = require("config");
            this.model = new cartModel(this.config.cart);
            this.render();

            if(this.model.get("id") && this.model.get("orderItems").length > 0) {
                //error View
                this.errorView = new errorView(this.model);

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
                
            }
            clearInterval(timerSaveP);
            $("#save-progress-bar").find("div").stop(true).animate({width: 100 + '%'},1000, function(){
                $('#box-progress').hide();
            });
             
        },
        render : function(){
            this.setElement(this.template({
                "model" : this.model.toJSON(),
                "config" : this.config
            }));
            this.$('#WeAlsoMake').html($('.blocWeAlsoMake').parents('.block-block').html());
            jQuery('#sidebar-second .blocWeAlsoMake').parents('.block-block').remove();
          
            $(this.config.containerId).html(this.$el);
        },
        changeShipping : function(orderItemShipping){
            this.model.set("orderItemShipping", orderItemShipping);
        }
        
    });

});
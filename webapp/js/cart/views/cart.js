define([
    'backbone',
    '../models/cart',
    'text!../templates/cart.html',
    'views/shipping',
    'views/jobView'
], function (Backbone, cartModel, cartTemplate, shippingView, jobView) {

    return Backbone.View.extend({
        template: _.template(cartTemplate),
        events: {
        },
        initialize: function() {
            _this = this;
            this.config = require("config");
            this.model = new cartModel(this.config.cart);
            this.render();

            //shipping View
            this.shippingView = new shippingView(this.model);

            //jobView
            _.each(this.model.toJSON().orderItems, function(item, i){
                var jobCeated;
                orderItems = _this.model.toJSON();
                orderItem = orderItems.orderItems[i];
                jobCeated = (item.files.length> 0)? true : false;

                _this.jobView = new jobView(orderItem, jobCeated);
            });


        },
        render : function(){
            this.setElement(this.template({
                "model" : this.model.toJSON(),
                "config" : this.config
            }));


            $(this.config.containerId).html(this.$el);
        }
        
    });

});
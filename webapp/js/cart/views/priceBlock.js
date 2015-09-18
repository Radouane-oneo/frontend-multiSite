define([
    'backbone',
    'text!../templates/priceBlock.html',
    'text!../templates/price.html'
], function (Backbone, priceBlockTemplate, priceTemplate) {

    return Backbone.View.extend({
        template: _.template(priceBlockTemplate),
        events: {
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
        }

    });

});
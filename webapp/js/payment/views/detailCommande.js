define([
    'backbone',
    'text!../templates/detailCommande.html',
    'text!../templates/price.html'
], function (Backbone, detailCommande, priceTemplate) {

    return Backbone.View.extend({
        template: _.template(detailCommande),
       
        initialize: function(model) {
            this.config = require("config");
            this.model = model;
            this.render();
            this.model.on("change",this.render,this);
        },
        render: function(){
            this.setElement(this.template({
                "model" : this.model.toJSON(),
                "config" : this.config,
                "priceTpl" : _.template(priceTemplate)
            }));
             $(this.config.containerId).find("#detailCommande").html(this.$el);
        },

    });

});
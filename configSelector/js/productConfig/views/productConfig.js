define([
    'backbone',
    'text!../templates/' + require("config").themeFile,
    '../models/productConfig',
    'text!../templates/price.html'
], function (Backbone, productConfigTemplate, productConfigModel, priceTemplate) {

    return Backbone.View.extend({
        template: _.template(productConfigTemplate),
        events: {
            "click .form-type-select" : "toggleExpand",
            "click .form-type-select a" : "preventDefault",
            "click .form-type-checkboxes" : "toggleExpand",
            "click .form-type-checkboxes a" : "preventDefault"
        },
        initialize: function() {
            this.config = require("config");
            this.model = new productConfigModel();
            this.render();
            this.model.on("change",this.render,this);
        },
        render:function(){
            this.setElement(this.template({
                "model" : this.model.toJSON(),
                "config" : this.config,
                "priceOption" : this.model.priceOption,
                "totalPrice" : this.model.totalPrice,
                "priceTpl" : _.template(priceTemplate)
            }));
            $(this.config.containerId).html(this.$el);
        },
        toggleExpand: function(e){
            $(e.currentTarget).toggleClass("expanded");
            $(e.currentTarget).next().slideToggle();
        },
        preventDefault: function(e){
            e.preventDefault();
        }
    });

});
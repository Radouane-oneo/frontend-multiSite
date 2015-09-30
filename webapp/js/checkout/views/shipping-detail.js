define([
    'backbone',
    'text!../templates/shipping-detail.html',
    '../helpers/ajaxCaller'
], function (Backbone, shippingDetailTemplate, ajaxCaller) {

    return Backbone.View.extend({
        template: _.template(shippingDetailTemplate),
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
                "model" : this.model.toJSON()
            }));

            $(this.config.blocDetail).find(".shipping").html(this.$el);

        },
        errors : function(){
            return false;
        }

    });

});
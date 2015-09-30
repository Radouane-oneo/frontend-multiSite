define([
    'backbone',
    'text!../templates/shipping-edit.html',
    '../helpers/ajaxCaller'
], function (Backbone, shippingEditTemplate, ajaxCaller) {

    return Backbone.View.extend({
        template: _.template(shippingEditTemplate),
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

            $(this.config.blocEdit).find(".shipping").html(this.$el);

        },
        errors : function(){
            return false;
        }

    });

});
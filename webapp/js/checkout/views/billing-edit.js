define([
    'backbone',
    'text!../templates/billing-edit.html',
    'views/Error'
], function (Backbone, billingEditTemplate, errorView) {

    return Backbone.View.extend({
        template: _.template(billingEditTemplate),
        events: {
        },
        initialize: function(model) {
            _this = this;
            this.config = require("config");
            this.model = model;
            this.render();
        },
        render : function(){
            this.setElement(this.template({
                "model" : this.model.toJSON()
            }));

            $(this.config.billingEditBox).html(this.$el);
        }
//        changeShipping : function(orderItemShipping){
//            this.model.set("orderItemShipping", orderItemShipping);
//        }
        
    });

});
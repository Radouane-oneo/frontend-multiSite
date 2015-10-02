define([
    'backbone',
    'text!../templates/billing-detail.html',
    'views/Error'
], function (Backbone, billingDetailTemplate, errorView) {

    return Backbone.View.extend({
        template: _.template(billingDetailTemplate),
        events: {
        },
        initialize: function(model) {
            _this = this;
            this.config = require("config");
            this.model = model;
            this.render();
            this.model.on("change",this.render, this);
        },
        render : function(){
            this.setElement(this.template({
                "model" : this.model.toJSON()
            }));

            $(this.config.billingDetailBox).html(this.$el);
        }
    });
});
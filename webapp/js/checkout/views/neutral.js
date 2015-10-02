define([
    'backbone',
    'text!../templates/neutral.html',
    '../helpers/ajaxCaller'
], function (Backbone, neutralTemplate, ajaxCaller) {

    return Backbone.View.extend({
        template: _.template(neutralTemplate),
        events: {
            "change #neutralRadioClick" : "neutralOption",
            "click #processPayment" : "processPayment"
        },
        initialize: function(model) {
            this.config = require("config");
            this.model = model;
            this.render();
        },
        render: function(){
            this.setElement(this.template({
                "model" : this.model.toJSON()
            }));
            $(this.config.neutralBox).append(this.$el);
        },
        neutralOption : function(e){
            var elmTarget = $(e.currentTarget);
            ajaxCaller.call("saveNeutralShipping",
            {'neutral' : elmTarget.is(':checked')}
            ).done(function(result) {
                
            });
        },
        processPayment : function(e){
            location.href = "/" + this.config.prefix + "/checkout/payment";
            return false;
        }
    });
});
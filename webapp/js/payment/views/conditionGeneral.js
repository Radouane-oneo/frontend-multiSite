define([
    'backbone',
    'text!../templates/conditionGeneral.html'
], function (Backbone, conditionGeneral) {

    return Backbone.View.extend({
        template: _.template(conditionGeneral),
       
        initialize: function(model) {
            this.config = require("config");
            this.model = model;
            this.render();
        },
        render: function(){
            this.setElement(this.template({
                "model" : this.model.toJSON(),
                "config" : this.config
            }));

            $(this.config.containerId).find("#conditionGeneral").html(this.$el);
        },

    });

});
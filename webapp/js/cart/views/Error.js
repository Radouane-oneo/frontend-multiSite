define([
    'backbone',
    'text!../templates/error.html'
], function (Backbone, errorTemplate) {

    return Backbone.View.extend({
        template: _.template(errorTemplate),
        events: {
        },
        initialize: function(model) {
            this.config = require("config");
            this.model = model;
            this.render();
            this.model.on("change",this.render,this);
        },
        render : function(message){
            this.setElement(this.template({
                "message" : message
            }));


            $(this.config.errorBox).html(this.$el);
        }

    });

});
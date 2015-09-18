define([
    'backbone',
    'text!../templates/customerReference.html',
    '../helpers/ajaxCaller'
], function (Backbone, customerReferenceTemplate, ajaxCaller) {

    return Backbone.View.extend({
        template: _.template(customerReferenceTemplate),
        events: {
            "change #edit-cart-reference-input" : "changeCustomerReference"
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
                "config" : this.config
            }));

            $(this.config.bottomBox).append(this.$el);
        },
        changeCustomerReference : function(e){
            this.model.set({"customerReference": $(e.currentTarget).val()}, {silent: true});
            ajaxCaller.call("changeCustomerReference",{
                cartId : this.model.id,
                orderRef : $(e.currentTarget).val()
            }).done(function(resultData){

            });
            e.preventDefault();
        }

    });

});
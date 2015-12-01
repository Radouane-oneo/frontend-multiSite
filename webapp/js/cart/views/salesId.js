define([
    'backbone',
    'text!../templates/salesId.html',
    '../helpers/ajaxCaller'
], function (Backbone, salesIdTemplate, ajaxCaller) {

    return Backbone.View.extend({
        template: _.template(salesIdTemplate),
        events: {
            "change #edit-cart-salesId-input" : "changeSalesId"
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
        changeSalesId : function(e){
            this.model.set({"salesId": $(e.currentTarget).val()}, {silent: true});
            ajaxCaller.call("changeSalesId",{
                cartId : this.model.id,
                salesId : $(e.currentTarget).val()
            }).done(function(resultData){
                if(resultData['data']['id'] === undefined){
                   console.log(resultData['data']);
                   $("#sales_id_message").show();
                   $("#edit-cart-salesId-input").val("");
                }else{
                   console.log(resultData['data']['id']);
                   $("#sales_id_message").hide();
                }

            });
            e.preventDefault();
        }

    });

});
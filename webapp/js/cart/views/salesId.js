define([
    'backbone',
    'text!../templates/salesId.html',
    '../helpers/ajaxCaller'
], function (Backbone, salesIdTemplate, ajaxCaller) {

    return Backbone.View.extend({
        template: _.template(salesIdTemplate),
        hasError: false,
        events: {
            "blur #edit-cart-salesId-input" : "changeSalesId"
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
            if(this.hasError)
                $("#sales_id_message").show();
        },
        changeSalesId : function(e){
            var me =this;
            this.model.set({"salesId": $("#edit-cart-salesId-input").val()}, {silent: true});
            ajaxCaller.call("changeSalesId",{
                cartId : this.model.id,
                salesId : $("#edit-cart-salesId-input").val()
            }).done(function(resultData){
                if(resultData['data']['id'] === undefined){
                   if($("#edit-cart-salesId-input").val()!=""){
                        $("#sales_id_message").show();
                        //$("#edit-cart-salesId-input").val("");
                        //console.log("true");
                       me.hasError=true;
                   }else{
                       $("#sales_id_message").hide();
                       me.hasError=false;
                   }
                }else{
                   $("#sales_id_message").hide();
                   //console.log("false");
                   me.hasError=false;
                }

            });
            //e.preventDefault();
        },
        errors : function(){ 
            return this.hasError;
        }

    });

});
define([
    'backbone',
    'text!../templates/vat-number-popup.html'
], function (Backbone, popupTemplate) {

    return Backbone.View.extend({
        template: _.template(popupTemplate),
        events: {
            "click .validVatNumber": "choseVatNumber"
        },
        initialize: function(model, data) {
            this.config = require("config");
            this.model = model;
            this.data = data;
            this.render();
        },
        render: function(){
            this.setElement(this.template({
                "model" : this.model.toJSON()
            }));
            //$(this.config.billingEditBox).find("#popUpContainer").append(this.$el);
            $.fancybox.open(this.$el,{
                openEffect  : 'none',
                closeEffect : 'none',
                autoSize : false,
                width    : "330px",
                height   : "100px",
                afterClose : function(){
                    myCheckout.billingEditView.$("#vatNumberBA").val("");
                }
            });
        },
        choseVatNumber: function(){
            var newBillngAccountList = jQuery.extend(true, {}, this.model.get('billingAccouts'));
            newBillngAccountList[_.toArray(newBillngAccountList).length] = this.data;
            this.model.set({'billingAccouts': newBillngAccountList, 'defaultBA': this.data});
        },
        neutralOption : function(e){
            var elmTarget = $(e.currentTarget);
            ajaxCaller.call("saveNeutralShipping",
            {'neutral' : elmTarget.is(':checked')}
            ).done(function(result) {
                
            });
        }
    });
});
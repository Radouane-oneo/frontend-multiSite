define([
    'backbone',
    'text!../templates/billing-edit.html',
    'views/Error',
    './vat-number-popup',
    '../helpers/ajaxCaller'
], function(Backbone, billingEditTemplate, errorView, vatView, ajaxCaller) {

    return Backbone.View.extend({
        template: _.template(billingEditTemplate),
        events: {
            "change #baEditSelect": "changeBA",
            "click #saveEditBA": "saveBA",
            "blur #vatNumberBA" : "showPopUp"
        },
        initialize: function(model) {
            _this = this;
            this.config = require("config");
            this.model = model;
            this.render();
            this.model.on("change", this.render, this);
        },
        render: function() {
            this.setElement(this.template({
                "model": this.model.toJSON()
            }));
            $(this.config.billingEditBox).html(this.$el);
        },
        showPopUp: function(e){
            var elmTarget = $(e.currentTarget);
            var me = this;
            if (elmTarget.val().length > 0) {
                ajaxCaller.call("getBillingAccountFromVat",
                {"vatNumber" : "BE"+elmTarget.val()},
                'GET').done(function(result) {
                    if(_.isEmpty(result.data) == false) {
                        var viePoup = new vatView(me.model, result.data);
                    };
                });
            }
        },
        saveBA: function(e) {
            var me = this;
            ajaxCaller.call("saveBillingAccount",
                {
                    "id": this.$('#baEditSelect').val(),
                    "name": this.$('#baName').val(),
                    "street": this.$('#baStreet').val(),
                    "city": this.$('#baCity').val(),
                    "postalCode": this.$('#baPostalCode').val(),
                    "country": this.$('#countryList').val(),
                    "company": this.$('#companyInput').val(),
                    "vatNumber": this.$('#vatNumberBA').val()
                    
                }, 'POST').done(function(result) {
		    if (result.id != $('#baEditSelect').val()) {
                        var newBillngAccountList = jQuery.extend(true, {}, me.model.get('billingAccouts'));
                        newBillngAccountList[_.toArray(newBillngAccountList).length] = result;
                        me.model.set({'billingAccouts': newBillngAccountList, 'defaultBA': result});
		    }
                });
            return false;
        },
        changeBA: function(e) {
            var elmTarget = $(e.currentTarget);
            var data = this.model.toJSON();
            var targetBA = _.find(data.billingAccouts, function(billingAccount) {
                return elmTarget.val() == billingAccount.id
            });
            if (targetBA != undefined) {
                this.model.set("defaultBA",targetBA);
            } else if (elmTarget.val() == 0) {
                this.$('.baInputs').val("");
                this.$('.baInputsSelect').val("");
            }
        }
    });
});

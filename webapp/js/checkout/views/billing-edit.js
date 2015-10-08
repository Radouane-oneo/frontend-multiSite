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
            "blur #vatNumberBA" : "showPopUp",
            "change #countryList" : "changeCountry"
        },
        initialize: function(model) {
	    this.enableSave = true;
            this.config = require("config");
            this.model = model;
            this.render();
            this.model.on("change", this.render, this);
        },
        render: function() {
            this.setElement(this.template({
                "model": this.model.toJSON()
            }));
            $(this.config.editBox).find(".billingBox").html(this.$el);
            this.displayVatBloc();
        },
        errors: function (isPaymentButton) {
            if(isPaymentButton)
                return false;
            var me = this;
            var result = null;
            this.$('.baInputs').css('border-color', '');
            this.$("#companyInput").css('border-color', '');
            this.$("#vatNumberBA").css('border-color', '');
            $('.baInputs').each(function (baInputs) {
                if ($(this).val() == '') {
                    $(this).css('border-color', 'red');
                    result = me.config.labels["BaFieldRequired"];
                    return false;
                } else if($(this).val().length <= 3) {
		    $(this).css('border-color', 'red');
		    result = me.config.labels["invalidCharactersLength"];
		}
            });
            if (result) {
                return result;
            }
            if (
                $("#isUserCompany").is(":checked") && ($("#companyInput").val() == "" || $("#vatNumberBA").val() == "")
                ) {
                $("#companyInput").css('border-color', 'red');
                $("#vatNumberBA").css('border-color', 'red');
                return this.config.labels["fieldCmpVatNumber"];
            }
        },
        showPopUp: function(e){
	    this.enableSave = false;
            var elmTarget = $(e.currentTarget);
            var me = this;
            if (elmTarget.val().length > 0) {
                ajaxCaller.call("getBillingAccountFromVat",
                {"vatNumber" : this.$('#countryIsoBA').val()+elmTarget.val()},
                'GET').done(function(result) {
		    me.enableSave = true;
                    if(_.isEmpty(result.data) == false) {
                        var viePoup = new vatView(me.model, result.data);
                    };
                });

	        ajaxCaller.call("vatlidateVatNumber",
                {"vatNumber" : this.$('#countryIsoBA').val()+elmTarget.val()},
                'GET').done(function(result) {
                    if(_.isEmpty(result.data) == false) {
			switch(result.data.valid.status) {
			   case 'VALID':
				elmTarget.css("border-color", "green");
				$('#countryIsoBA').css("border-color", "green");
				me.enableSave = true;
			   break;
			   default:
				elmTarget.css("border-color", "red");
				$('#countryIsoBA').css("border-color", "red");
			   break;
			}
                    };
                });
            }
        },
        saveBA: function(e) {
	    if (this.enableSave == false) {
	        return false;
	    }
            var me = this;
	    var billingError = this.errors();
	    if(!billingError && this.enableSave == false) {
	        billingError =  this.config.labels["invalidVatNumber"]
	    }
            if( billingError) {
                myCheckout.errorView.render(billingError);
                $(window).scrollTop($(this.config.containerId).offset().top);
                return false;
            }
            ajaxCaller.call("saveBillingAccount",
                {
                    "id": this.$('#baEditSelect').val(),
                    "name": this.$('#baName').val(),
                    "street": this.$('#baStreet').val(),
                    "city": this.$('#baCity').val(),
                    "postalCode": this.$('#baPostalCode').val(),
                    "country": this.$('#countryList').val(),
                    "company": this.$('#companyInput').val(),
                    "vatNumber": this.$('#countryIsoBA').val() + this.$('#vatNumberBA').val()
                    
                }, 'POST').done(function(result) {
		    if (result.id != $('#baEditSelect').val() && $('#baEditSelect').val() != 0) {
                        var newBillngAccountList = jQuery.extend(true, {}, me.model.get('billingAccouts'));
		        newBillngAccountList = _.without(newBillngAccountList, _.findWhere(newBillngAccountList, {id: parseInt($('#baEditSelect').val())}));
                        newBillngAccountList[_.toArray(newBillngAccountList).length] = result;
                        me.model.set({'billingAccouts': newBillngAccountList, 'defaultBA': result});
		    } else if($('#baEditSelect').val() == 0) {
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
                this.$('#baName').val(targetBA.name);
                this.$('#baStreet').val(targetBA.street);
                this.$('#baCity').val(targetBA.city);
                this.$('#baPostalCode').val(targetBA.postalCode);
                this.$('#countryList').val(targetBA.country);
                this.$('#companyInput').val(targetBA.company);
                this.$('#vatNumberBA').val(targetBA.vatNumber);
                this.displayVatBloc();
            } else if (elmTarget.val() == 0) {
                this.$('.baInputs').val("");
                this.$("#companyInput").val("");
                this.$("#vatNumberBA").val("");
            }
        },
        displayVatBloc: function(){
            document.getElementById("isUserCompany").checked = false;
            this.$(".form-item-invoice-address-current-company").hide();
            this.$(".form-item-invoice-address-current-vatNumber").hide();
            if(this.$('#companyInput').val() != "" && this.$('#vatNumberBA').val()!= "") {
                document.getElementById("isUserCompany").checked = true;
                this.$(".form-item-invoice-address-current-company").show();
                this.$(".form-item-invoice-address-current-vatNumber").show();
            }
        },
        changeCountry: function(e){
            this.$("#countryIsoBA").val(_.findWhere(this.model.get("countries"), {id : parseInt($(e.currentTarget).val())}).iso);
        }
    });
});

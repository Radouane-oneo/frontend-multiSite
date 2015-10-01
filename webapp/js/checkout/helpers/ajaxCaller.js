define([], function () {
    return{
        urls: {
            "saveBillingAccount" : "/checkout/savenewinvoiceanddelivery",
            "getBillingAccountFromVat" : "/checkout/getBillingAccoutFromVat",
            "saveNeutralShipping" : "/checkout/saveNeutralShipping"
        },
        call : function(action, data, method, params){
            if (!method) {method = "POST"}
            if (!params) {params = ""}
            var config = require("config");
            return $.ajax({
                type: method,
                url: "/" + config.prefix + this.urls[action] + params,
                data : data
            }).done(function(resultData) {
                //myCart.disable = false;
            }).error(function(){
                console.log("erro");
            });
        }

    }
});

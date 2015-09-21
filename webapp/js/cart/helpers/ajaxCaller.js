define([], function () {
    return{
        urls: {
            "deleteDiscount" : "/webapp/deleteDiscount.json",
            "addDiscount" : "/cart/ajax/applydiscount",
            "changeShipping" : "/webapp/changeShipping.json",
            "changeCustomerReference" : "/cart/ajax/setreforder",
            "deleteJob" :    "/cart/ajax/removeitem/",
            "deleteJobDesign" :    "/cart/ajax/removedesign/",
            "deleteFileCheck" :    "/cart/ajax/removefilecheck/",
            "setRefJob" :    "/cart/ajax/setrefjob",
            "setMailDeisigner" :    "/cart/ajax/setemaildesigner"
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

            });
        }

    }
});

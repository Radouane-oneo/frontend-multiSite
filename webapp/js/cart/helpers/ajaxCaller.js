define([], function () {
    return{
        urls: {
            "deleteDiscount" : "/cart/ajax/removediscount",
            "addDiscount" : "/cart/ajax/applydiscount",
            "changeShipping" : "/cart/ajax/selectshippingtype/",
            "changeCustomerReference" : "/cart/ajax/setreforder",
            "deleteJob" :    "/cart/ajax/removeitem/"
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

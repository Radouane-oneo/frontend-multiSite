define([], function () {
    return{
        urls: {
            "deleteDiscount" : "/webapp/deleteDiscount.json",
            "addDiscount" : "/cart/ajax/applydiscount",
            "changeShipping" : "/webapp/changeShipping.json",
            "changeCustomerReference" : "/cart/ajax/setreforder",
            "deleteJob" :    "/webapp/deleteOrderItem.json"
        },
        call : function(action, data){
            var config = require("config");
            return $.ajax({
                type: "POST",
                url: "/" + config.prefix + this.urls[action],
                data : data
            }).done(function(resultData) {

            });
        }

    }
});

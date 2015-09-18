define([], function () {
    return{
        urls: {
            "deleteDiscount" : "/webapp/deleteDiscount.json",
            "addDiscount" : "/webapp/addDiscount.json",
            "changeShipping" : "/webapp/changeShipping.json",
            "changeCustomerReference" : "/cart/ajax/setreforder"
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

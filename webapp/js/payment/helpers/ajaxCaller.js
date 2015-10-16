define([], function () {
    return{
        urls: {
            "saveMethodPayment" :    "/checkout/ajax/savepaymentmethod/"
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

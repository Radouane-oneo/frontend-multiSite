define([], function () {
    return{
        urls: {
            "deleteDiscount" : "/webapp/deleteDiscount.json",
            "addDiscount" : "/webapp/addDiscount.json",
            "deleteJob" :    "/befr/cart/ajax/removeitem/",
            "changeShipping" : "/webapp/changeShipping.json"
        },
        call : function(action, data, method, params){
            if (!method) {method = "POST"};
            if (!params) {params = ""};
            
            return $.ajax({
                type: method,
                url: this.urls[action] + params,
                data : data
            }).done(function(resultData) {

            });
        }

    }
});

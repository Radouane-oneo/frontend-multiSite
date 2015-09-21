define([], function () {
    return{
        urls: {
            "deleteDiscount" : "/webapp/deleteDiscount.json",
            "addDiscount" : "/webapp/addDiscount.json",
            "deleteJob" :    "/webapp/deleteOrderItem.json",
            "changeShipping" : "/webapp/changeShipping.json"
        },
        call : function(action, data){
            return $.ajax({
                type: "POST",
                url: this.urls[action],
                data : data
            }).done(function(resultData) {

            });
        }

    }
});

define([
    'backbone',
    'text!/' + GlobalPrefix + '/cart/ajax/getcart',
    'text!/' + GlobalPrefix + '/checkout/ajax/getpaymentmethods'
], function (Backbone, cartJSON, paymentMethodsJSON) {
    GlobalLabels["updateProduct"] = "updateProduct";
    var parsedJSON = "";
    try {
        parsedJSON = $.parseJSON(cartJSON);
    } catch (e) {
        parsedJSON = {};
    }
    return {
        containerId : '#myPayment',
        errorBox : '#errorBox',
        methodePayment : '#methodePayment',
        detailCommande : '#detailCommande',
        conditionGeneral : '#conditionGeneral',        
        cart : parsedJSON,
        paymentMethods : $.parseJSON(paymentMethodsJSON).data.paymentMethods,
        customerName : $.parseJSON(paymentMethodsJSON).data.customerName,
	customerFcp : $.parseJSON(paymentMethodsJSON).data.customerFcp,
        amountWithoutPayment : $.parseJSON(paymentMethodsJSON).data.amountWithoutPayment,
        vat : GlobalVat,
        prefix : GlobalPrefix,
        isConnected : isConnected,
        langId : GlobalLandId,
        labels : GlobalLabels
    };

});

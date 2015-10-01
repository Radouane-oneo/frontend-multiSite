define([
    'backbone',
    'text!/' + GlobalPrefix + '/cart/ajax/getcart',
    'text!/' + GlobalPrefix + '/cart/ajax/getshippingtypes'
], function (Backbone, cartJSON, shippingJSON) {
    GlobalLabels["updateProduct"] = "updateProduct";
    var parsedJSON = "";
    try {
        parsedJSON = $.parseJSON(cartJSON);
    } catch (e) {
        parsedJSON = {};
    }
    return {
        containerId : '#myCart',
        errorBox : '#errorBox',
        jobBox : '#jobBox',
        detailTechnic : '#technic-details',
        bottomBox : '#bottomBox',
        cart : parsedJSON,
        shipping : $.parseJSON(shippingJSON).data,
        vat : GlobalVat,
        prefix : GlobalPrefix,
        isConnected : isConnected,
        langId : GlobalLandId,
        designtoolLink : 'http://designtool.prd.printconcept.com',
        labels : GlobalLabels
    };

});

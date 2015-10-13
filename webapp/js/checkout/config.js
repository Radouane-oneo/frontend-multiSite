define([
    'backbone',
    'text!/' + GlobalPrefix + '/checkout/ajax/getbillingaccounts',
    'text!countries.json',
    'text!/' + GlobalPrefix + '/checkout/ajax/getshippingaddresses'
], function (Backbone, BillingJSON, CountriesListJson, shippingAddressesJson) {
    var billingAccountList = "";
    var shippingAddresses = "";
    var vat = GlobalVat;
    var CountriesList = "";
    var defaultBA = null;
    try {
        billingAccountList = $.parseJSON(BillingJSON);

        shippingAddresses = $.parseJSON(shippingAddressesJson);

        billingAccountList = billingAccountList.data;
        CountriesList = $.parseJSON(CountriesListJson);
        vat = billingAccountList.vat;
        delete billingAccountList.discountCode;
        delete billingAccountList.vat;
        $.each(billingAccountList, function(i, billingAccount){
            if (billingAccount.isDefault) {
                defaultBA = billingAccount;
            }
        });

    } catch (e) {
        billingAccountList = {};
        shippingAddresses = {};
        CountriesList = {};
        vat = GlobalVat;
    }
   
    return {
        containerId : '#myCheckout',
        errorBox : '#errorBox',
        detailBox : '#blocDetail',
        editBox : '#blocEdit',
        shippingBox : '#shippingBox',
        neutralBox : '#neutralBox',
        billingAccouts : billingAccountList,
        shippingAddresses : shippingAddresses.data,
        defaultBA : defaultBA,
        vat : vat,
        prefix : GlobalPrefix,
        isConnected : isConnected,
        isNeutral : neutral,
        countries : CountriesList,
        langId : '10',
        designtoolLink : 'http://designtool.prd.printconcept.com',
        labels : ChekoutGlobalLabels
        
    };

});

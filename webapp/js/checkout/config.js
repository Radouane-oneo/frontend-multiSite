define([
    'backbone',
    'text!/' + GlobalPrefix + '/checkout/ajax/getbillingaccounts',
    'text!/' + GlobalPrefix + '/checkout/countriesList',
    'text!/' + GlobalPrefix + '/checkout/ajax/getshippingaddresses'
], function (Backbone, BillingJSON, CountriesListJson, shippingAddressesJson) {
    var billingAccountList = "";
    var shippingAddresses = "";
    var vat = GlobalVat;
    var CountriesList = "";
    try {
        billingAccountList = $.parseJSON(BillingJSON);
        shippingAddresses = $.parseJSON(shippingAddressesJson);
        CountriesList = $.parseJSON(CountriesListJson);
        vat = billingAccountList.data.vat;
    } catch (e) {
        billingAccountList = {};
        shippingAddresses = {};
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
        vat : vat,
        prefix : GlobalPrefix,
        isConnected : isConnected,
        countries : CountriesList.data,
        langId : '10',
        designtoolLink : 'http://designtool.prd.printconcept.com',
        labels : {
            "formatBrut" : "Format brut",
            "BillingAccount" : "ADRESSE DE FACTURATION",
            "changeBA" : "Changer l'adresse de facturation",
            "selectBA" : "SÉLECTIONNEZ UNE ADRESSE",
            "OrCreateBA" : "Ou créez une nouvelle adresse en remplissant le formulaire ci-dessous.",
            "addNewBA" : "Ajouter une adresse",
            "BAName" : "Nom",
            "StreetBA" : "N° et Rue",
            "CityBA" : "Ville",
            "postalCodeCityBA" : "Code Postale",
            "CountryBA" : "Pays",
            "HaveVatNumber" : "J'ai une numéro de TVA",
            "CompanyBA" : "Entreprise",
            "VatNumberBA" : "Numéro de Tva",
            "BAFieldsRequired" : "Ce champ est requis.",
            "existingBA" : "this billing address is already exist would you want load this address as your default billing address",
            "shippingAddress" : "Shipping address"
        }
        
    };

});

define([
    'backbone',
    'text!/' + GlobalPrefix + '/checkout/ajax/getbillingaccounts',
    'text!/' + GlobalPrefix + '/checkout/countriesList'
], function (Backbone, BillingJSON, CountriesListJson) {
    var billingAccountList = "";
    var vat = GlobalVat;
    var CountriesList = "";
    try {
        billingAccountList = $.parseJSON(BillingJSON);
        CountriesList = $.parseJSON(CountriesListJson);
        console.log(billingAccountList);
        vat = parsedJSON.data.vat;
    } catch (e) {
        billingAccountList = {};
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
        vat : vat,
        prefix : GlobalPrefix,
        isConnected : GlobalPrefix,
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
        }
        
    };

});

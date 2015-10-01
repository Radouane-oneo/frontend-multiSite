define([
    'backbone',
    'text!/' + GlobalPrefix + '/checkout/ajax/getbillingaccounts',
    'text!/' + GlobalPrefix + '/checkout/countriesList'
], function (Backbone, BillingJSON, CountriesListJson) {
    var billingAccountList = "";
    var vat = GlobalVat;
    var CountriesList = "";
    var defaultBA = null;
    try {
        billingAccountList = $.parseJSON(BillingJSON);
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
        vat = GlobalVat;
    }
   
    return {
        containerId : '#myCheckout',
        errorBox : '#errorBox',
        billingDetailBox : '#blocDetail',
        billingEditBox : '#blocEdit',
        shippingBox : '#shippingBox',
        neutralBox : '#neutralBox',
        billingAccouts : billingAccountList,
        defaultBA : defaultBA,
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
            "NeutralShippingTitle" : "ENVOI NEUTRE",
            "NeutralShipping" : "Envoi neutre",
            "Neutralexplain" : "Voulez-vous votre commande sans mention de Flyer.fr sur la boîte? S'il vous plaît cocher cette case.",
            "securePaymentBtn" : "Paiement sécurisé",
            "BAalreadyExisting" : "this billing address is already exist would you want load this address as your default billing address"
        }
        
    };

});

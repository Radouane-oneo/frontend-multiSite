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
    try {
        billingAccountList = $.parseJSON(BillingJSON);
        shippingAddresses = $.parseJSON(shippingAddressesJson);
        CountriesList = $.parseJSON(CountriesListJson);
        vat = billingAccountList.data.vat;
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
        vat : vat,
        prefix : GlobalPrefix,
        isConnected : isConnected,
        countries : CountriesList,
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
            "shippingAddress" : "Shipping address",
            "changeShippingAddress" : "Change shipping address",
            "openingHours" : "Heures d'ouverture",
            "day_1" : "Lundi",
            "day_2" : "Mardi",
            "day_3" : "Mercredi",
            "day_4" : "Jeudi",
            "day_5" : "Vendredi",
            "day_6" : "Samedi",
            "day_7" : "Dimanche",
            "shippingFlyerstore" :'Vous avez choisi "Enlèvement dans un FlyerStore"',
            "shippingBpost" :'Vous avez choisi "Enlèvement dans un point poste"',
            "chooseFlyerstore" : "Choisissez votre FlyerStore",
            "chooseBpost" : "Choisissez votre point poste",
            "infoTitleFlyerstore" : "Qui va collecter la commande dans le FlyerStore?",
            "infoTitleBpost" : "Qui va collecter la commande dans le point poste?",
            "yourName" : "Votre nom et prénom",
            "requiredField" : "Ce champ est requis.",
            "save" : "Enregistrer",
            "selectSA" : "SÉLECTIONNEZ UNE ADRESSE",
            "OrCreateSA" : "Ou créez une nouvelle adresse en remplissant le formulaire ci-dessous.",
            "addNewSA" : "Ajouter une adresse",
            "SAName" : "votre nom livraison",
            "StreetSA" : "N° et Rue",
            "CitySA" : "Ville",
            "postalCodeCitySA" : "Code Postale",
            "CountrySA" : "Pays",
            "CompanySA" : "La livraison se fait chez une entreprise ? Veuillez remplir le nom"
        }
        
    };

});

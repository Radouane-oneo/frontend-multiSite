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
            "CompanySA" : "La livraison se fait chez une entreprise ? Veuillez remplir le nom",
            "NeutralShippingTitle" : "ENVOI NEUTRE",
            "NeutralShipping" : "Envoi neutre",
            "Neutralexplain" : "Voulez-vous votre commande sans mention de Flyer.fr sur la boîte? S'il vous plaît cocher cette case.",
            "securePaymentBtn" : "Paiement sécurisé",
            "BAalreadyExisting" : "this billing address is already exist would you want load this address as your default billing address",
            "shippingTypeStoreError" : "shippingTypeStoreError",
            "nameEmptyError" : "nameEmptyError",
            "shippingTypeBpostPickupPointError" : "shippingTypeBpostPickupPointError",
            "phone" : "phone",
            "email" : "email",
            "requiredFieldsError" : "Veuillez remplir tout les champs obligatoires",
            "emailError" : "Adresse email n'est pas valide"
        }
        
    };

});

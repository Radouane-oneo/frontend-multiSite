define([
    'backbone',
    'text!/' + GlobalPrefix + '/cart/ajax/getcart',
    'text!/' + GlobalPrefix + '/cart/ajax/getshippingtypes'
], function (Backbone, cartJSON, shippingJSON) {
    var parsedJSON = "";
    try {
        parsedJSON = $.parseJSON(cartJSON);
    } catch (e) {
        parsedJSON = {};
    }
    return {
        containerId : '#myCheckout',
        errorBox : '#errorBox',
        billingBox : '#billingBox',
        shippingBox : '#shippingBox',
        neutralBox : '#neutralBox',
        cart : parsedJSON,
        shipping : $.parseJSON(shippingJSON).data,
        vat : GlobalVat,
        prefix : GlobalPrefix,
        isConnected : GlobalPrefix,
        langId : '10',
        designtoolLink : 'http://designtool.prd.printconcept.com',
        labels : {
            "formatBrut" : "Format brut",
            "formatFini" : "Format fini",
            "bleed" : "Débords",
            "color" : "Couleur",
            "resolution" : "Résolution",
            "downloadTemplateText" : "Téléchargez les gabarits pour ce format",
            "formatToProvide" : "Format à fournir",
            "technicalDetails" : "DÉTAILS TECHNIQUES",
            "technicalDescription" : "Vous devez préparer vos fichiers pour l'impression ? Le type de fichier idéal est JPG ou PDF/X-1a:2001",
            "shipping" : "Livraison",
            "chooseFlyerStore" : "Choisissez votre FlyerStore",
            "chooseBpostPickupPoint" : "Choisissez votre point de relais",
            "free" : "GRATUIT",
            "discountCode" : "Code de réduction",
            "discountText" : "Avez-vous un code promotionnel, un coupon de réduction ou un chèque-cadeau ? Saisissez votre code ici svp.",
            "apply" : "Appliquer",
            "discountsCode" : "Réductions",
            "useCode" : "Vous utilisez le code",
            "customerReference" : "La référence client",
            "customerReferenceText" : "Avez-vous besoin d'une référence sur votre facture ?",
            "subTotal" : "Total HTVA",
            "subTotalVat" : "Montant de la TVA",
            "subTotalWithTVA" : "Total TVA incluse",
            "pay" : "Payer",
            "nameFlyerStore" : "Nom du Flyerstore",
            "openingHours" : "Heures d'ouverture",
            "day_1" : "Lundi",
            "day_2" : "Mardi",
            "day_3" : "Mercredi",
            "day_4" : "Jeudi",
            "day_5" : "Vendredi",
            "day_6" : "Samedi",
            "day_7" : "Dimanche",
            "chooseOtherFlyerStore" : "Choisissez un autre FlyerStore",
            "nameBpost" : "Nom du point poste",
            "chooseOtherBpostPickupPoint" : "Choisissez un autre point poste",
            'downloadDevis' : 'Téléchargez le panier en devis',
            'designtoolTitle' : 'Téléchargez votre fichier ou créez en ligne',
            'dlLinkTitle' : 'DESIGNTOOL',
            'dlLinkSubtitle' : 'Pour tous les clients (recommandé)',
            'dtOptions1' : 'Téléchargez votre fichier dans notre designtool',
            'dtOptions2' : 'Recevez un aperçu de vos impressions',
            'dtOptions3' : 'Faites votre conception gratuitement en ligne',
            'dtOptions4' : 'Contrôle du fichier optionnel (4,99 € hors TVA)',
            'dtOptionsModule' : 'Adaptez un de nos',
            'dtOptionsModuleLink' : '1000+ modèles gratuits en ligne',
            'dtBtnText' : 'COMMENCER',
            'proUploadLinkTitle' : 'PRO UPLOAD',
            'proUploadLinkSubtitle' : 'Pour les graphistes professionnels',
            'proUploadOptions1' : 'Téléchargez immédiatement votre fichier à imprimer',
            'proUploadOptions2' : 'Fichiers de max. 200 MB',
            'proUploadOptions3' : 'Contrôle du fichier optionnel (4,99 € hors TVA)',
            'proUploadRespecte' : 'Respectez les',
            'proUploadTechnices' : 'détails techniques',
            'proUploadParams' : 'paramètres prédéfinis',
            'proUploadBtnText' : 'COMMENCER',
            'or' : 'ou',
            'graphisteOptions' : 'Je ne vais pas télécharger moi-même les fichiers. Mon graphiste va le faire pour moi.',
            'graphisteAdresse' : 'Adresse e-mail du designer',
            'graphisteAttention' : "Attention !! Si vous avez choisi l'option 'fichiers téléchargés par mon graphiste', nous ne pouvons pas vous garantir la date de livraison pour l'instant.",
            'ex' : 'ex',
            'refjob' : 'reference job',
            'previsualis' : 'Prévisualiser',
            'updatePage' : 'Modifier la mise en page',
            'deleteOrder' : 'Supprimer',
            'fotoliaImg' :  'Fotolia Image',
            'controleProfessionel' : 'Contrôle professionel de',
            'jobNotNullError' : 'jobNotNullError',
            'jobNotNullErrorMail' : 'set adresse of designer',
            'jobNotNullErrorMailNotValid' : 'Adresse de designer not valid',
            'shippingNotNullError' : 'shippingNotNullError',
            'mustConnectedError' : 'Pour activer votre code de réduction, cliquez sur ‘votre compte’ et connectez vous. Ensuite, returnez vers ‘votre panier’.',
            'invalidDiscountCode' : 'Sorry, this coupon code was already used or not validated',
            'cartIsEmpty' : 'Votre panier est vide.',
            'continue' : 'Continuer les achats'
        }
        
    };

});

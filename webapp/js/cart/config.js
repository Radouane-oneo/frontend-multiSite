define([
    'backbone',
    'text!../../cart.json',
    'text!../../shipping.json'
], function (Backbone, cartJSON, shippingJSON) {
    return {
        containerId : '#myCart',
        jobCreated : true,
        cart : $.parseJSON(cartJSON),
        shipping : $.parseJSON(shippingJSON),
        labels : {
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
            'test' : 'test test'
        }
        
    };

});

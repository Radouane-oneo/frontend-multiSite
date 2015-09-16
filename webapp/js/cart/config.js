define([
    'backbone',
    'text!../../cart.json',
    'text!../../shipping.json'
], function (Backbone, cartJSON, shippingJSON) {
    return {
        containerId : "#myCart",
        cart : $.parseJSON(cartJSON),
        shipping : $.parseJSON(shippingJSON),
        labels : {
            "shipping" : "Livraison",
            "chooseFlyerStore" : "Choisissez votre FlyerStore",
            "chooseBpostPickupPoint" : "Choisissez votre point de relais",
            "free" : "GRATUIT"
        }
        
    };

});

define([
    'backbone',
    'text!../flyerBe-fr-1.json'
], function (Backbone, toolBoxGroups) {

    return {
        themeFile : "productConfig-flyer.html",
        containerId : "#myForm",
        toolBoxGroups : $.parseJSON(toolBoxGroups),
        TVA : 0.21,
        labels : {
            "productName" : "productName",
            "productId" : 1,
            "langId" : 10,
            "productDescription" : "productDescription",
            "options" : "Options",
            "noOptions" : "noOptions",
            "quantity" : "quantity",
            "priceNoTVA" : "priceNoTVA",
            "priceWithTVA" : "priceWithTVA",
            "enterQuantity" : "enterQuantity",
            "calculate" : "calculate",
            "totalNoTVA" : "totalNoTVA",
            "addToCart" : "addToCart",
            "technicalDetails" : "technicalDetails",
            "technicalDescription" : "technicalDescription",
            "size" : "size",
            "bleed" : "bleed",
            "color" : "color",
            "resolution" : "resolution",
            "downloadText" : "downloadText"
        }
    };

});
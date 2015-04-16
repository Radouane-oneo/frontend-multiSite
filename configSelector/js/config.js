define([
    'backbone',
    'text!../flyerBe-fr-1.json'
], function (Backbone, toolBoxGroups) {
    var configJSON = $.parseJSON(toolBoxGroups);
    return {
        themeFile : "productConfig-flyer.html",
        containerId : "#myForm",
        toolBoxGroups : configJSON["data"],
        TVA : configJSON["vat"],
        defaultItems : [],
        defaultOptions : [],
        defaultQuantity : null,
        imagesUrl : configJSON["imagesUrl"],
        labels : {
            "productName" : configJSON["name"],
            "productId" : configJSON["id"],
            "langId" : 10,
            "productDescription" : configJSON["shortDescription"] + configJSON["longDescription"] + configJSON["baselineDescription"],
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
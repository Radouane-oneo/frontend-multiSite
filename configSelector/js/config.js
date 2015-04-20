define([
    'backbone',
], function (Backbone) {
    var configJSON = JsonFileGroups;
    return {
        themeFile : "productConfig-flyer.html",
        containerId : "#myForm",
        toolBoxGroups : configJSON["data"],
        TVA : configJSON["vat"],
        defaultItems : [],
        defaultOptions : [],
        defaultQuantity : null,
        imagesUrl : configJSON["imagesUrl"],
        labels : GlobalLabels

    };

});
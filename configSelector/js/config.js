define([
    'backbone',
], function (Backbone) {
    var configJSON = JsonFileGroups;
    GlobalLabels['productId'] = JsonFileGroups.id;
    GlobalLabels['productName'] = JsonFileGroups.name;
    GlobalLabels['productDescription'] = JsonFileGroups.shortDescription + JsonFileGroups.longDescription + JsonFileGroups.baselineDescription;
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
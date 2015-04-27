define([
    'backbone',
], function (Backbone) {
    GlobalLabels['productId'] = JsonFileGroups.id;
    GlobalLabels['productName'] = JsonFileGroups.name;
    GlobalLabels['productDescription'] = unescape(JsonFileGroups.shortDescription + JsonFileGroups.longDescription + JsonFileGroups.baselineDescription);
    return {
        themeFile : "productConfig-flyer.html",
        containerId : "#myForm",
        toolBoxGroups : JsonFileGroups["data"],
        TVA : JsonFileGroups["vat"],
        defaultItems : GlobalDefaultItems,
        defaultOptions : GlobalDefaultOptions,
        defaultQuantity : GlobalDefaultQuantity,
        imagesUrl : JsonFileGroups["imagesUrl"],
        labels : GlobalLabels,
        isAdmin : 1
    };

});
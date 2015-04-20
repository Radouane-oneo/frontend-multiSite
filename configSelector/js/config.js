define([
    'backbone',
], function (Backbone) {
    //var configJSON = JsonFileGroups;
    GlobalLabels['productId'] = JsonFileGroups.id;
    GlobalLabels['productName'] = JsonFileGroups.name;
    GlobalLabels['productDescription'] = unescape(JsonFileGroups.shortDescription + JsonFileGroups.longDescription + JsonFileGroups.baselineDescription);
    return {
        themeFile : "productConfig-flyer.html",
        containerId : "#myForm",
        toolBoxGroups : JsonFileGroups["data"],
        TVA : JsonFileGroups["vat"],
        defaultItems : [],
        defaultOptions : [],
        defaultQuantity : null,
        imagesUrl : JsonFileGroups["imagesUrl"],
        labels : GlobalLabels,
        isAdmin : GlobalIsAdmin
    };

});
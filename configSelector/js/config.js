define([
    'backbone',
    'text!/products/getjson/' + GlobalProductId
], function (Backbone, JsonFile) {
    var JsonFileGroups = $.parseJSON(JsonFile);
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
        isAdmin : GlobalIsAdmin
    };

});

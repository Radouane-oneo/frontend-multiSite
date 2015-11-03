define([
    'backbone',
    'text!/' + GlobalPrefix + '/products/getjson/' + GlobalProductId
], function (Backbone, JsonFile) {
    var JsonFileGroups = $.parseJSON(JsonFile);
    GlobalLabels['productId'] = JsonFileGroups.id;
    GlobalLabels['productName'] = JsonFileGroups.name;
    GlobalLabels['productDescription'] = unescape(JsonFileGroups.shortDescription + JsonFileGroups.longDescription + JsonFileGroups.baselineDescription);
    GlobalLabels['customFormat'] = JsonFileGroups.customFormat;
    GlobalLabels['format'] = JsonFileGroups.format;
    GlobalLabels['minHCF'] = JsonFileGroups.heightMin;
    GlobalLabels['maxHCF'] = JsonFileGroups.heightMax;
    GlobalLabels['minWCF'] = JsonFileGroups.widthMin;
    GlobalLabels['maxWCF'] = JsonFileGroups.widthMax;
    GlobalLabels['minTOL'] = JsonFileGroups.toleranceMin;
    GlobalLabels['maxTOL'] = JsonFileGroups.toleranceMax;
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
        isAdmin : GlobalIsAdmin,
        prefix : GlobalPrefix,
        jobId : GlobalJobId,
        bannerUrl : GlobalBannerUrl
    };

});

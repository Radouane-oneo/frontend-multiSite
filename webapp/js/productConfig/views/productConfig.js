define([
    'backbone',
    'text!../templates/' + require("config").themeFile,
    '../models/productConfig',
    'text!../templates/price.html',
    'text!../templates/footerPrice.html'
], function (Backbone, productConfigTemplate, productConfigModel, priceTemplate, footerPriceTemplate) {

    return Backbone.View.extend({
        template: _.template(productConfigTemplate),
        events: {
            "click .form-type-select" : "toggleExpand",
            "click .form-type-checkboxes" : "toggleExpand",
            "click .dropdown a" : "changeToolBoxGroup",
            "change #edit-options input.form-checkbox" : "changeOptions",
            "change #prices-table input.form-radio" : "changeQuantity",
            "click #prices-table tbody tr:not(.custom)" : "selectInput",
            "click #edit-calculer" : "calculatePrice",
          //  "change #prices-table input.form-custom-radio" : "calculatePrice",
            "keypress #edit-custom" : "checkQuantity",
            "click #deadlinestooltip legend" : "toggleCollapse",
            "click #deadlinestooltip legend a" : "preventDefault",
            "focus #edit-custom" : "editCustomQuantity",
            "click .calculCF " : "calculCF",
            "click #edit-actions-addtocart" : "calculCFOrder",
            "click .banner-link-product" : "bannerClickProduct",
            "click .banner-link" : "bannerClick",
            "click .banner-link-visite" : "bannerClickVisite",
            "click .banner-link-folder" : "bannerClickFolder",
            "click #mailpopup .close" : "bannerClose",
            "click .send-popin" : "formControl",
            "click #divpopup" : "divpopup"
        },
        initialize: function() {
            this.config = require("config");
            this.model = new productConfigModel();
            this.render();
            this.model.on("change",this.render,this);
            clearInterval(timerSaveP);
            $("#save-progress-bar").find("div").stop(true).animate({width: 100 + '%'},1000, function(){
                $('#box-progress').hide();
            });
        },
        render:function(){
            this.setElement(this.template({
                "model" : this.model.toJSON(),
                "config" : this.config,
                "priceOption" : this.model.priceOption,
                "totalPrice" : this.model.totalPrice,
                "priceTpl" : _.template(priceTemplate),
                "footerPriceTpl" : _.template(footerPriceTemplate),
                "shippingHTML" : this.$("#bloc-shipping").html(),
                "customQuantity" : !(this.model.get("toolBoxGroup")["pricing"][this.model.get("quantity")]),
                "expandedOptions" : this.$("#edit-options").is(":visible")
                        // "pricing" : this.model.toolBoxGroup.pricing
            }));
             this.$('#popupbox').html($('.mailing-container').parents('.block-block').html());
            jQuery('#sidebar-second .mailing-container').parents('.block-block').remove();
            $(this.config.containerId).html(this.$el);
        
            var existQuantity = '';
            if($("#edit-custom").val()){
                _.each(this.model.get("toolBoxGroup")["pricing"], function(price, i){
                    console.log(i);
                    console.log(parseInt($("#edit-custom").val()));
                    if(parseInt($("#edit-custom").val()) == i) {
                        existQuantity = i;
                        return true
                    }
                });


                console.log('lolo'+existQuantity);
                if (existQuantity == ''){console.log('lolo'+existQuantity);
                    $('#trQuantitePersonalisee').show();
                }
            }
            this.$("#bloc-shipping").load("/" + this.config.prefix + "/getshippingdate #edit-shipping", {
                "productId" : this.config.labels['productId'],
                "items" : this.model.get("toolBoxGroup")["toolboxItems"],
                "options" : this.model.get("options"),
                "quantity" : this.model.get("quantity")
            });
            if(this.model.get("submit")) {
                $("#pcproducts-config-form").submit();
            }
        },
        toggleExpand: function(e){
            $(e.currentTarget).toggleClass("expanded");
            $(e.currentTarget).next().slideToggle();
        },
        toggleCollapse: function(e){
            var fieldSet = $(e.currentTarget).parents("#deadlinestooltip");
            if(fieldSet.hasClass("collapsed")) {
                fieldSet.removeClass("collapsed");
                $(e.currentTarget).next().hide();
                $(e.currentTarget).next().slideToggle();
            } else {
                $(e.currentTarget).next().slideToggle().promise().done(function(){
                    fieldSet.addClass("collapsed");
                });
            }
        },
        preventDefault: function(e){
            e.preventDefault();
        },
        changeToolBoxGroup: function(e, submit){
            if(!e.isTrigger && parseInt($(e.currentTarget).parents(".dropdown").attr("data-id")) == this.config.labels["format"]) {
                this.model.set({
                    "widthCF": null,
                    "heightCF":null,
                    "CF":null
                },{silent: true});
            }
            $('.msgErrorCF').text('');
            $('.msgCFValid').text('');
            var dropDown = $(e.currentTarget).parents(".dropdown");
            var selectEl = dropDown.prev();
            var oldSelectedValue = selectEl.find("div.selected-item").attr("data-id");
            var selectedItems = [];
            var me = this;
            if(!submit)
            selectEl.click();

            this.$("div.selected-item").each(function(){
                var selectedItem = ($(this).attr("data-id")==oldSelectedValue) ? $(e.currentTarget).attr("id") : $(this).attr("data-id");
                selectedItems.push(parseInt(selectedItem));
            });

            dropDown.promise().done(function(){
                me.model.setToolBoxGroup(selectedItems, submit);
                $(window).scrollTop(me.$(".form-type-select").offset().top);
            });

            e.preventDefault();
        },
        changeOptions: function(){
            var options = [];
            var me = this;

            $("#edit-options").find("input.form-checkbox:checked").each(function(){
                options.push(parseInt($(this).val()));
            });

            me.model.set("options", options);
        },
        changeQuantity: function(e){
            var customHeight = this.model.get('heightCF');
            var customWidth  = this.model.get('widthCF');
            if((customHeight) && (customWidth)){
                var price = ((customHeight * customWidth * _.toArray(this.model.get("toolBoxGroup")["pricing"])[0]["sellPrice"]) / (1 * 1000 * 1000)) * 1;
                console.log('price1custom: '+price+ 'quantity1custom' + 1);    
                this.model.set({
                "price" : price,
                "quantity" : 1
                });
            }else{
                var quantity = parseInt($(e.target).val());
                var pricing = this.model.get("toolBoxGroup")["pricing"][quantity];
                var price = (pricing["promoPrice"]) ? pricing["promoPrice"] : pricing["sellPrice"];
                this.model.set({
                    "price" : price,
                    "quantity" : quantity
                });
            }
        },
        selectInput: function(e){
            $(e.currentTarget).find("input.form-radio").attr("checked","checked");
            $(e.currentTarget).find("input.form-radio").change();
        },
        calculatePrice: function(){
            
            var quantity = parseInt(this.$("#edit-custom").val());
            if(isNaN(quantity)) return false;
            
            if(isNaN(quantity)){
                $('#trQuantitePersonalisee').hide();
            }
            else{
               $('#trQuantitePersonalisee').show();     
            }
            
            var pricing = this.model.get("toolBoxGroup")["pricing"][quantity];
            var price = null;
            var customHeight = this.model.get('heightCF');
            var customWidth  = this.model.get('widthCF');
            if(pricing && !(customHeight) && !(customWidth)){
                price = (pricing["promoPrice"]) ? pricing["promoPrice"] : pricing["sellPrice"];
            } else {
                price = this.model.calculatePrice(quantity);
            }
            this.model.set({
                "price" : price,
                "quantity" : quantity
            });
            return false;
        },
        calculCF: function(e){
            
            var minHCF = this.config.labels['minHCF'];
            var maxHCF = this.config.labels['maxHCF'];
            var minWCF = this.config.labels['minWCF'];
            var maxWCF = this.config.labels['maxWCF'];
            var minTOL = this.config.labels['minTOL'];
            var maxTOL = this.config.labels['maxTOL'];
            var wcf = $('#wcf').val();
            var hcf = $('#hcf').val();
            if (wcf == '' || hcf == ''){
                if (wcf == '') $('#wcf').css({ "border":"1px solid red", "color":"red"});else $('#wcf').css({ "border":"1px solid #8f8f8f", "color":"#8f8f8f"});
                if (hcf == '') $('#hcf').css({ "border":"1px solid red", "color":"red"}); else $('#hcf').css({ "border":"1px solid #8f8f8f", "color":"#8f8f8f"});
                $('.msgErrorCF').text($('#msgErrorCF').val());
                return false;
            }
            if (isNaN(hcf) && isNaN(wcf)){
                $('#hcf').css({ "border":"1px solid red", "color":"red"});
                $('#wcf').css({ "border":"1px solid red", "color":"red"});
                console.log($('#msgErrorCFNotFloat').val());
                $('.msgErrorCF').text($('#msgErrorCFNotFloat').val());
                return false;
            }
            else{
                $('#wcf').css({ "border":"1px solid #8f8f8f", "color":"#8f8f8f"});
                $('#hcf').css({ "border":"1px solid #8f8f8f", "color":"#8f8f8f"});  
            }
            if (isNaN(hcf)){
                $('#hcf').css({ "border":"1px solid red", "color":"red"});
                $('#wcf').css({ "border":"1px solid #8f8f8f", "color":"#8f8f8f"});
                $('.msgErrorCF').text($('#msgErrorCFNotFloat').val());
                return false;
            }
            else {
                $('#hcf').css({ "border":"1px solid #8f8f8f", "color":"#8f8f8f"});
            }
            if(isNaN(wcf)){
                $('#wcf').css({ "border":"1px solid red", "color":"red"});
                $('#hcf').css({ "border":"1px solid #8f8f8f", "color":"#8f8f8f"});
                $('.msgErrorCF').text($('#msgErrorCFNotFloat').val());
                return false;
            }
            else
                $('#wcf').css({ "border":"1px solid #8f8f8f", "color":"#8f8f8f"});
            var wcfVal = parseFloat(wcf.replace(",", "."));                      
            var hcfVal = parseFloat(hcf.replace(",", "."));
            if ( (hcfVal < minHCF || hcfVal > maxHCF) && (wcfVal < minWCF || wcfVal > maxWCF)){
                $('#hcf').css({ "border":"1px solid red", "color":"red"});
                $('#wcf').css({ "border":"1px solid red", "color":"red"});                
                $('.msgErrorCF').html(
                        $('#textHeightNotValid').val() +" "+ minHCF + " mm "  + $('#et').val()+" " +maxHCF+ " mm."
                        + " <br>" + 
                        $('#textWidthNotValid').val() +" "+ minWCF + " mm " + $('#et').val() +" " +maxWCF+ " mm.");
                return false;
            }
            if ( wcfVal < minWCF || wcfVal > maxWCF){
                console.log(minWCF);
                $('#wcf').css({ "border":"1px solid red", "color":"red"});
                $('.msgErrorCF').text($('#textWidthNotValid').val() +" "+ minWCF + " mm " + $('#et').val() +" " +maxWCF+ " mm.");
                return false;
            }
            if ( hcfVal < minHCF || hcfVal > maxHCF){
                $('#hcf').css({ "border":"1px solid red", "color":"red"});
                $('.msgErrorCF').text($('#textHeightNotValid').val() +" "+ minHCF + " mm "  + $('#et').val()+" " +maxHCF+ " mm.");
                return false;
            }  
            
            $('.msgErrorCF').text("");              
            if (wcfVal > hcfVal) var cfTol = wcfVal / hcfVal; else var cfTol = hcfVal / wcfVal;
            console.log('minT'+ maxTOL);
            if ( cfTol < minTOL || cfTol > maxTOL) {
                $('#wcf').css({ "border":"1px solid red", "color":"red"});
                $('#hcf').css({ "border":"1px solid red", "color":"red"});
                $('.msgErrorCF').text($('#textTolNotValid').val() +" "+ minTOL + " "  + $('#et').val()+" " +maxTOL+ ".");
                return false;
            }
            
            if (( wcfVal >= minWCF && wcfVal <= maxWCF ) &&  ( hcfVal >= minHCF && hcfVal <= maxHCF ) &&  ( cfTol >= minTOL && cfTol <= maxTOL ))
            {                
                $('.msgCFValid').text($('#msgCFValid').val());
                $('#wcf').css({ "border":"1px solid #8f8f8f", "color":"#8f8f8f"});
                $('#hcf').css({ "border":"1px solid #8f8f8f", "color":"#8f8f8f"}); 
                this.model.set({
                           "widthCF": wcfVal,
                           "heightCF":hcfVal,
                           "CF":"CF",
                           "quantity" : 1
                       },{silent: true});
                   this.$("li.CF a").trigger("click");
            }
                       
        },
        calculCFOrder: function(e){ 
            var minHCF = this.config.labels['minHCF'];
            var maxHCF = this.config.labels['maxHCF'];
            var minWCF = this.config.labels['minWCF'];
            var maxWCF = this.config.labels['maxWCF'];
            var minTOL = this.config.labels['minTOL'];
            var maxTOL = this.config.labels['maxTOL'];
            var wcf = $('#wcf').val();
            var hcf = $('#hcf').val();
            if ((wcf == '' && hcf == '') || (typeof wcf == 'undefined' && typeof hcf == 'undefined')){
                return true;
            }
            else{
                if (wcf == '' || hcf == ''){
                    if (wcf == '' && hcf != '') $('#wcf').css({ "border":"1px solid red", "color":"red"});else $('#wcf').css({ "border":"1px solid #8f8f8f", "color":"#8f8f8f"});
                    if (hcf == '' && wcf != '') $('#hcf').css({ "border":"1px solid red", "color":"red"}); else $('#hcf').css({ "border":"1px solid #8f8f8f", "color":"#8f8f8f"});
                    $('.msgErrorCF').text($('#msgErrorCF').val());
                    return false;
                }
                if (isNaN(hcf) && isNaN(wcf)){
                    $('#hcf').css({ "border":"1px solid red", "color":"red"});
                    $('#wcf').css({ "border":"1px solid red", "color":"red"});
                    $('.msgErrorCF').text($('#msgErrorCFNotFloat').val());
                    return false;
                }
                else{
                    $('#wcf').css({ "border":"1px solid #8f8f8f", "color":"#8f8f8f"});
                    $('#hcf').css({ "border":"1px solid #8f8f8f", "color":"#8f8f8f"});  
                }
                if (isNaN(hcf)){
                    $('#hcf').css({ "border":"1px solid red", "color":"red"});
                    $('#wcf').css({ "border":"1px solid #8f8f8f", "color":"#8f8f8f"});
                    $('.msgErrorCF').text($('#msgErrorCFNotFloat').val());
                    return false;
                }
                else {
                    $('#hcf').css({ "border":"1px solid #8f8f8f", "color":"#8f8f8f"});
                }
                if(isNaN(wcf)){
                    $('#wcf').css({ "border":"1px solid red", "color":"red"});
                    $('#hcf').css({ "border":"1px solid #8f8f8f", "color":"#8f8f8f"});
                    $('.msgErrorCF').text($('#msgErrorCFNotFloat').val());
                    return false;
                }
                else
                    $('#wcf').css({ "border":"1px solid #8f8f8f", "color":"#8f8f8f"});
                var wcfVal = parseFloat(wcf.replace(",", "."));                      
                var hcfVal = parseFloat(hcf.replace(",", "."));
                if ( (hcfVal < minHCF || hcfVal > maxHCF) && (wcfVal < minWCF || wcfVal > maxWCF)){
                    $('#hcf').css({ "border":"1px solid red", "color":"red"});
                    $('#wcf').css({ "border":"1px solid red", "color":"red"});                
                    $('.msgErrorCF').html(
                            $('#textHeightNotValid').val() +" "+ minHCF + " mm "  + $('#et').val()+" " +maxHCF+ " mm."
                            + " <br>" + 
                            $('#textWidthNotValid').val() +" "+ minWCF + " mm " + $('#et').val() +" " +maxWCF+ " mm.");
                    return false;
                }
                if ( wcfVal < minWCF || wcfVal > maxWCF){
                    console.log(minWCF);
                    $('#wcf').css({ "border":"1px solid red", "color":"red"});
                    $('.msgErrorCF').text($('#textWidthNotValid').val() +" "+ minWCF + " mm " + $('#et').val() +" " +maxWCF+ " mm.");
                    return false;
                }
                if ( hcfVal < minHCF || hcfVal > maxHCF){
                    $('#hcf').css({ "border":"1px solid red", "color":"red"});
                    $('.msgErrorCF').text($('#textHeightNotValid').val() +" "+ minHCF + " mm "  + $('#et').val()+" " +maxHCF+ " mm.");
                    return false;
                }  
            
                $('.msgErrorCF').text("");              
                if (wcfVal > hcfVal) var cfTol = wcfVal / hcfVal; else var cfTol = hcfVal / wcfVal;
                console.log('minT'+ maxTOL);
                if ( cfTol < minTOL || cfTol > maxTOL) {
                    $('#wcf').css({ "border":"1px solid red", "color":"red"});
                    $('#hcf').css({ "border":"1px solid red", "color":"red"});
                    $('.msgErrorCF').text($('#textTolNotValid').val() +" "+ minTOL + " "  + $('#et').val()+" " +maxTOL+ ".");
                    return false;
                }
            
                if (( wcfVal >= minWCF && wcfVal <= maxWCF ) &&  ( hcfVal >= minHCF && hcfVal <= maxHCF ) &&  ( cfTol >= minTOL && cfTol <= maxTOL ))
                {             
                    $('.msgCFValid').text($('#msgCFValid').val());
                    $('#wcf').css({ "border":"1px solid #8f8f8f", "color":"#8f8f8f"});
                    $('#hcf').css({ "border":"1px solid #8f8f8f", "color":"#8f8f8f"}); 
                    this.model.set({
                               "widthCF": wcfVal,
                               "heightCF":hcfVal,
                               "CF":"CF"
                           },{silent: true});
                           //console.log(this.model);
                            this.$("li.CF a").trigger("click", 1);
                       return true;
                }
         }
        },
        checkQuantity: function(e){
            if(e.which != 8 && isNaN(String.fromCharCode(e.which)))
                e.preventDefault();
        },
        editCustomQuantity: function(){
            $("#edit-quantity-custom").attr("checked", "checked");
        },
        bannerClickProduct: function(e){
            e.preventDefault();
            var pdfProduct = $("#pdfProduct").val();
            var pdfTrack = $("#pdfTrack").val();
            _gaq.push(['_trackEvent', 'PDFdownloads', 'click', pdfTrack]);
            $('#mailpopup').fadeIn();
            
            $("#popupFormId").attr("action","/download.php?product="+pdfProduct);
            // $("<div class='grey-bg-popup'></div>").insertAfter("#canvas");
            $('#remerciement').attr('style','display:none');
            // $('.grey-bg-popup').fadeIn();   
            $('#divpopup').fadeIn();
            $('#hideshow').attr('style','display:block');			
        },
        bannerClick: function(e){
            e.preventDefault();
             _gaq.push(['_trackEvent', 'PDFdownloads', 'click', 'affichegids']);
            $('#mailpopup').fadeIn();
            $("#popupFormId").attr("action","/downloadaffiche.php");
           // $("<div class='grey-bg-popup'></div>").insertAfter("#canvas");
            $('#remerciement').attr('style','display:none');
           // $('.grey-bg-popup').fadeIn();   
           $('#divpopup').fadeIn();
           $('#hideshow').attr('style','display:block');			
        },
        bannerClickFolder: function(e){
            e.preventDefault();
             _gaq.push(['_trackEvent', 'PDFdownloads', 'click', 'leadgen-folder']);
            $('#mailpopup').fadeIn();
            $("#popupFormId").attr("action","/downloadfolder.php");
           // $("<div class='grey-bg-popup'></div>").insertAfter("#canvas");
            $('#remerciement').attr('style','display:none');
           // $('.grey-bg-popup').fadeIn();   
           $('#divpopup').fadeIn();
           $('#hideshow').attr('style','display:block');			
        },
        bannerClickVisite: function(e){  
             e.preventDefault();
            _gaq.push(['_trackEvent', jQuery("#trackEvent2").attr('value'), 'click', jQuery("#trackEvent4").attr('value')]);
            $('#mailpopup').fadeIn();
            $("#popupFormId").attr("action","/downloadvisite.php");
           // $("<div class='grey-bg-popup'></div>").insertAfter("#canvas");
            $('#remerciement').attr('style','display:none');
           // $('.grey-bg-popup').fadeIn();   
           $('#divpopup').fadeIn();
           $('#hideshow').attr('style','display:block');			
        },
        bannerClose: function(){
           $('#mailpopup').fadeOut();
          //  $('.grey-bg-popup').fadeOut();
           // $("<div class='grey-bg-popup'></div>").remove();
            $('#divpopup').fadeOut();
        },
        divpopup: function(e){
            e.preventDefault();
            $('#mailpopup').fadeOut();
            $('#divpopup').fadeOut();
        },
        formControl: function(){
            var emailAddressValue = $('#EMAIL_FIELD').val();//.trim; 
            var langue = $("#MOEDERTAAL_FIELD").val();
            if(emailAddressValue == ''|| $('#EMAIL_FIELD') == null){
                $('#EMAIL_FIELD').css({ "border":"1px solid red", "color":"red"});
                $('#EMAIL_FIELD').val('');
                if(langue == 'NL')
                    $('#EMAIL_FIELD').attr('placeholder','email is verplicht.');
                else
                    $('#EMAIL_FIELD').attr('placeholder','e-mail est obligé.');
                $('#EMAIL_FIELD').focus();   
                return false;
            }else{
                var emailAddressRegex = /^[^@\s]+@[^\.@\s]+(\.[^@\s^\.]+)+$/;
                if (!emailAddressRegex.test(emailAddressValue)){               
                    $('#EMAIL_FIELD').css({ "border":"1px solid red", "color":"red"});
                    $('#EMAIL_FIELD').val('');                    
                if(langue == 'NL')
                    $('#EMAIL_FIELD').attr('placeholder','Het emailadres klopt niet, controleer of er een @ in staat.');  
                else
                    $('#EMAIL_FIELD').attr('placeholder','Adresse e-mail incorrecte, veuillez vérifier la syntaxe.');
                    return false;
                }
                else{
                    $('#EMAIL_FIELD').css({ "border":"1px solid #8f8f8f", "color":"#8f8f8f"});
                     
                    var formData = {}; 
                    jQuery("#mailpopup input[type='hidden']").each(function(){ 
                        formData[jQuery(this).attr('name')] =  jQuery(this).attr('value');
                    });
                    formData["EMAIL_FIELD"] = jQuery("#EMAIL_FIELD").val();
                    formData["FIRSTNAME_FIELD"] = jQuery("#FIRSTNAME_FIELD").val();
                    $.ajax({
                        type: "POST",
                        url: url,
                        data: formData, 
                        success: function(data){
                          // $(location).attr('href',goto);
                          $('#hideshow').attr('style','display:none');
                          $('#remerciement').attr('style','display:block');
                            $('#mailpopup').fadeIn();
                          //$("#popupFormId").attr("action",goto);
                          $("#popupFormId").submit();
                        },
                        error: function(jqXHR, textStatus, ex) { 
                          $('#hideshow').attr('style','display:none');
                          $('#remerciement').attr('style','display:block');
                          $('#mailpopup').fadeIn();
                         // $("#popupFormId").attr("action",goto);
                          $("#popupFormId").submit();
                        }  
                    });
                }
            }
        },
    });

});
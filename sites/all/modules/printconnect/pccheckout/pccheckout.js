(function ($) {

    /* popup button annuler */
    $(".button_null_address_vat").live("click", function () {
             $("#edit-vatnumber-number").val('');
             $('#fademe').removeClass('black_overlay2');
             $('#fademe').addClass('black_overlay');
    });
    $(".valid-button-btt").live("click", function () {
        var number = $('.number').val();
        var country = $('.country').val();
        $('#fademe').removeClass('black_overlay2');
        $('#fademe').addClass('black_overlay');
        $.getJSON(Drupal.settings.basePath + 'index.php?q=/billingAccountVat/' + country + number, function (dataset) {
            var billingAccountResult = '<input type="hidden" name="billingAccountResult" value="'+dataset.id+'">';
            $("input[name='billingAccountResult']").remove();
            $('#pccheckout-invoiceanddelivery-form #invoice-address').before(billingAccountResult);
            $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-name, #edit-name').val(dataset.name);
            $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-street, #edit-street').val(dataset.street);
            $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-postalCode, #edit-postalcode').val(dataset.postalCode);
            $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-city, #edit-city').val(dataset.city);
            $('#pccheckout-invoiceanddelivery-form #companyInput, #companyInput').val(dataset.company);

            if($('#pccheckout-invoiceanddelivery-form')[0]){
            $('#invoice-address input[type=text]').attr('readonly', true);
            $('#edit-invoice-address-current-country').attr('disabled', true);
            $('#isUserCompany').attr('disabled', true);
            }

        });
    });

    var UserCompany;

    /* display  vat & company input afther click box */
    $("#isUserCompany").live('click', function () {
        if (this.checked){
            UserCompany = "yes";
            $(".form-item-company, .form-item-vatNumber, .form-item-invoice-address-current-company, .form-item-invoice-address-current-vatNumber").show();
        } else {
            UserCompany = "no";
            $("#companyInput, .number ").val('');
            $(".form-item-company, .form-item-vatNumber, .form-item-invoice-address-current-company, .form-item-invoice-address-current-vatNumber").removeClass('error');
            $(".form-item-company, .form-item-vatNumber, .form-item-invoice-address-current-company, .form-item-invoice-address-current-vatNumber").hide();
        }
    });


    $(document).ready(function () {

        jQuery(".selectBilling2").select2();
        jQuery(".selectStyle").select2();

        if ($('#pccheckout-invoiceanddelivery-form  input[name="pcflyerstores[id]"]').val() != ''){
            $('#allresault').show();
            $('#pccheckout-invoiceanddelivery-form #edit-summary-shipping h6').html($('#pccheckout-invoiceanddelivery-form .storcomande h2').html());
            $('#pccheckout-invoiceanddelivery-form #edit-summary-shipping .address').html($('#pccheckout-invoiceanddelivery-form  .storcomande .address').html());
            $('#pccheckout-invoiceanddelivery-form #edit-summary-shipping .phone').html($('#pccheckout-invoiceanddelivery-form  .storcomande .phone').html());
            $('#pccheckout-invoiceanddelivery-form #edit-summary-shipping .fax').html($('#pccheckout-invoiceanddelivery-form  .storcomande .fax').html());
            $('#pccheckout-invoiceanddelivery-form #edit-summary-shipping .email').html($('#pccheckout-invoiceanddelivery-form  .storcomande .email').html());
           }
        if (typeof $("#isUserCompany")[0] != "undefined") {
            if ($("#companyInput").val() != '') {
                $("#isUserCompany")[0].checked = true;
                $(".form-item-company, .form-item-vatNumber, .form-item-invoice-address-current-company, .form-item-invoice-address-current-vatNumber").show();
            } else {
                $("#isUserCompany")[0].checked = false;
                $(".form-item-company, .form-item-vatNumber, .form-item-invoice-address-current-company, .form-item-invoice-address-current-vatNumber").hide();
            }
        }


        /***********Script pour remplacer fieldset par div***********/

        var fieldsetContent = $("#invoice-address > legend").html();
        $("#invoice-address > legend").replaceWith("<div class='legend legend2'>" + fieldsetContent + "</div>");
        var fieldsetContent = $("#shipping-address > legend").html();
        $("#shipping-address > legend").replaceWith("<div class='legend legend1'>" + fieldsetContent + "</div>");


        /* add prop readonly to invoice-address on load page */
        if(!$('.error')[0]){
            $('#invoice-address input[type=text]').attr('readonly', true);
                    $('#edit-invoice-address-current-country').attr('disabled', true);

                if ($("#edit-invoice-address-current-select")[0]) {
                    if ($('#edit-invoice-address-current-select').val() == 0) {
                        $('#isUserCompany').attr('disabled', false);
                    } else {
                        $('#isUserCompany').attr('disabled', true);
                    }
                } else {
                    $('#isUserCompany').attr('disabled', false);
                }
        }

        /* end */

    });

    $.fn.checkoutOverlay = function (overlay) {
        $(this).once(function () {
            overlay = overlay.clone();
            overlay.show();
            overlay.css('display', 'block');
            overlay.css('position', 'absolute');
            overlay.css('z-index', '1000');
            overlay.css('top', $(this).attr('offsetTop'));
            overlay.css('left', $(this).attr('offsetLeft'));
            overlay.css('width', $(this).outerWidth());
            overlay.css('height', $(this).outerHeight());
            $('.filler', overlay).css('width', $(this).outerWidth());
            $('.filler', overlay).css('height', $(this).outerHeight());
            $(this).parent().append(overlay);
            overlay.position($(this).position());
        });
    }


Drupal.behaviors.pccheckout = {
        detach: function (context) {
        },
        attach: function (context, settings) {

        var  agree = "no";
        $("#edit-agree").live('click', function () {
            if (this.checked){
                agree = "yes";
            }
        });
       $('input.payment[type="submit"]').click(function (e) {
            if($('.storcomande').length > 0){
                if(!!$('.messages.error .store-select').length) $('.messages.error .store-select').remove();
                if ($('input[name="pcflyerstores[id]"]').val() == ''){
                    if(!$('.messages.error').length)$('.region.region-content').before('<div class="messages error"></div>');
                    $('.messages.error').append('<li class="store-select">Merci de choisir un flyer store</li>');
                    $('body, html').animate({scrollTop: $(".messages.error").offset().top-50 }, '300', 'swing', function() {});
                    return false;
                }
            }
        });

//$('#pccheckout-payment-form').submit(function (e) {
//    if (agree == "no"){
//     e.preventDefault();
//     $("#jsagree").remove();
//     $(".form-item-agree").after('<p id="jsagree" style=" color: white; text-align: center; background-color:#ff6600;">' + Drupal.t('champ obligatoire') + '<p>').fadeIn();
//    }
//});

    $('#pccheckout-personal-form').submit(function (e) {
                           var number = $('.number');
                           var company = $('#companyInput');
                           if (UserCompany == "yes") {
                               if (number.val() == '' || company.val() == '') {
                                   e.preventDefault();
                                    number.addClass('error');
                                    company.addClass('error');

                               }
                           }
});

        $('#pccheckout-invoiceanddelivery-form').submit(function (e) {

               if (!ValidateNameLength()) return false;

               var number = $('#edit-invoice-address-current-vatnumber-number');
               var company = $('#companyInput');

               $('#invoice-address input[type=text]').blur(function (){
                    if($(this).val() == ''){
                      $(this).addClass('error');
                    }else{
                      $(this).removeClass('error');
                    }
               });

               if (UserCompany == "yes") {
                   if (number.val() == '' || company.val() == '') {
                       e.preventDefault();
                       $('#edit-invoice-address-current-vatnumber-number').addClass('error');
                       $('#companyInput').addClass('error');
                       $('#edit-invoice-address-current-vatnumber-country').addClass('error');

                   }
               }

           });

           function ValidateNameLength() {
                var length = $('#edit-shipping-detail-contact').val().length;
                if (!!$('.name-length').length) $('.messages.error .name-length').remove();
                if (length>32){
                    if(!$('.messages.error').length)$('.region.region-content').before('<div class="messages error"></div>');
                    $('.messages.error').append('<li class="name-length">'+Drupal.t('The name length should not be longer than 32 letters')+'</li>');
                    $('body, html').animate({scrollTop: $(".messages.error").offset().top-50 }, '300', 'swing', function() {});
                    return false;
                }
                else {
                    return true;
                }
           }

    var pricePaiement = 0;

    $("#pccheckout-payment-form  table.payment-methods-table tbody tr").mousedown(function () {
                if ($(this).find('input.grid').is(":not(:checked)")) {
                    var id = $(this).find('input.grid').val();
                    $.post('/Methods/'+id);
                    var hiddenPricesPayment = $('#hiddenPricesPayment').find('input.paymentMethod_' + id).val();
                    var descriptionTag = $('#hiddenPricesPayment').find('input.paymentMethod_' + id).attr('descriptionTag');
                    var name = $('#hiddenPricesPayment').find('input.paymentMethod_' + id).attr('PaymentName');
                    $('#edit-payment-method-text').html(descriptionTag);
                    pricePaiement = hiddenPricesPayment;

                    var wholevat = pricePaiement.split(".")[0];
                    var decPartvat = pricePaiement.split(".")[1];
                    if (pricePaiement == 0) {
                        wholevat = decPartvat = 0;
                    }
                   var contentTr = '<tr class="even"><td class="first-child"><span id="orderItemsPayment"><strong>' + name + '</strong><span></td><td class="last-child"><span class="price"><span class="value"><span class="whole">' + wholevat + '</span><span class="decimalpoint">,</span><span class="decimals">' + decPartvat + '</span>&nbsp;<span class="currency">€</span></span></span></td></tr>';
                   if ($("#orderItemsPayment")[0]){
                  $('#orderItemsPayment').parents("tr").replaceWith(contentTr);
                    } else {
                  $('.page-checkout-payment #edit-overview').find('.total-excl-vat').before(contentTr);
                    }

                    var map = [];
                    var totalprice = 0;
                    $("#pccheckout-payment-form #CalculePrice input").each(function () {
                        map.push(parseFloat($(this).val()));
                    });

                    map.forEach(function (Price) {
                        totalprice += Price;
                    });

                    var myprice = totalprice + parseFloat(pricePaiement);
                    flotmyprice = myprice.toFixed(2) + "";


                    var whole = flotmyprice.split(".")[0];
                    var decPart = flotmyprice.split(".")[1];

                    var contenthtml = '<tr class="total-excl-vat odd last-child"><td class="first-child">Total HTVA</td><td class="last-child"><span class="price"><span class="value"><span class="whole">' + whole + '</span><spanclass="decimalpoint">,</span><span class="decimals">' + decPart + '</span>&nbsp;<span class="currency">€</span></span></span></td> </tr>';
                    $('.page-checkout-payment .overview table ').find('tr.total-excl-vat').replaceWith(contenthtml);

                    //* Get var from order to calculate price.
                    var vat;
                    try{
                        vat = Drupal.settings.pccheckout.VatCart;
                        vat = parseFloat(vat);
                    }catch(e){
                    }
                    if(isNaN(vat) || vat == null ){
                        vat = 0.21;
                    }

                    vat = parseFloat(vat);
                    var vatprice = myprice * vat;
                    var total = myprice + vatprice;
                    total = total.toFixed(2) + "";
                    var wholevat = total.split(".")[0];
                    var decPartvat = total.split(".")[1];
                    var End = '<span id="price" class="price"><label>Total TTC</label><span class="value"><span class="whole">' + wholevat + '</span><span class="decimalpoint">,</span><span class="decimals">' + decPartvat + '</span>&nbsp;<span class="currency">€</span></span></span>';
                    $('.page-checkout-payment #edit-actions').find('#price').replaceWith(End);


                }

           });


    if ($("#pccheckout-payment-form table ")) {
        var width = (662 / $("#pccheckout-payment-form  table.payment-methods-table tbody tr").length) - 21.2;
        $('#pccheckout-payment-form').find('table.payment-methods-table tbody tr').css('width', width + 'px');
        $('#pccheckout-payment-form').find('table.payment-methods-table tbody tr.last-child').css('border-right', 'none');
    }


    $(".popupOverlay").live('click', function () {
        $('#popup_overlay.popin_overlay').css('display', 'block');
    });

    $(".headpopin .closeme").live('click', function () {
        $('#popup_overlay.popin_overlay').css('display', 'none');
    });


    /* Show adresses  after lod page if it's already visibel */

    jQuery('#pccheckout-invoiceanddelivery-form fieldset.tohiding').hide();
    var hash = location.hash;
    if (hash != "") {
        jQuery("#pccheckout-invoiceanddelivery-form fieldset.tohiding" + hash).show();
    }


    /* Show adresses  summary on click */

    $('#pccheckout-invoiceanddelivery-form .summary .toggle').once().click(function () {
        var url = jQuery(this).attr('href');
        var target = url.substring(url.indexOf('#'));
        jQuery('form fieldset.tohiding').hide();
        jQuery(target).show();
        jQuery(".select2-display-none").hide();
    });

    /* setInvoiceAddress from select  */
    $('.form-item-invoice-address-current-select #edit-invoice-address-current-select').on('change', function () {
        setInvoiceAddress($(this).val());
    });
    /*  setShppingAddress from select  */
    $('.form-item-shipping-detail-current-select #edit-shipping-detail-current-select').on('change', function () {
        setShppingAddress($(this).val());
    });



    /* change prefix vat  if countr country changed */

    $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-country').change(function () {
        var url = Drupal.settings.basePath + '?q=js/country/' + $(this).val();
        $.getJSON(url, null, function (data) {
            $('#edit-invoice-address-current-vatnumber-country').val(data.vatPrefix).trigger('change');
        });
    });

      $('#pccheckout-personal-form #edit-country').change(function () {
        var url = Drupal.settings.basePath + '?q=js/country/' + $(this).val();
        $.getJSON(url, null, function (data) {
            $('#edit-vatnumber-country').val(data.vatPrefix).trigger('change');
        });
    });

        }
    }

function setInvoiceAddress(id) {
    if (id == 0) {
        $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-name').val('');
        $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-street').val('');
        $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-postalCode').val('');
        $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-city').val('');
          $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-country option[value="73"]').attr("selected","selected");
        $('#pccheckout-invoiceanddelivery-form #select2-chosen-3').html($('#edit-invoice-address-current-country option:selected').text());
        $('#pccheckout-invoiceanddelivery-form #companyInput').val('');
        $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-vatnumber-country').val('FR');
        $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-vatnumber-number').val('');

        $('#isUserCompany').attr('disabled', false);
        $('#invoice-address input[type=text]').attr('readonly', false);
        $('#edit-invoice-address-current-country').attr('disabled', false);
    } else {
        var url = Drupal.settings.basePath + 'invoceform/' + id;
        $.getJSON(url, function (data) {

        $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-name').val(data.name);
        $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-street').val(data.street);
        $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-postalCode').val(data.postalCode);
        $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-city').val(data.city);
        $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-country option[value="'+data.country+'"]').attr("selected","selected");
        $('#pccheckout-invoiceanddelivery-form #select2-chosen-3').html($('#edit-invoice-address-current-country option:selected').text());
        $('#invoice-address input[type=text]').attr('readonly', true);
        $('#edit-invoice-address-current-country').attr('disabled', true);
        $('#isUserCompany').attr('disabled', true);
        if( $("input[name='billingAccountResult']")[0]){
            $("input[name='billingAccountResult']").remove();
        }

    if (data.vatNumber) {
        $('#isUserCompany').attr('checked', true);
        $(".form-item-company, .form-item-vatNumber, .form-item-invoice-address-current-company, .form-item-invoice-address-current-vatNumber").show();
        $('#pccheckout-invoiceanddelivery-form #companyInput').val(data.company);
        $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-vatnumber-country').val(data.iso);
        $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-vatnumber-number').val(data.vatNumber.substring(2));
    } else {
        $('#pccheckout-invoiceanddelivery-form #companyInput').val('');
        $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-vatnumber-country').val(data.iso);
        $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-vatnumber-number').val('');
        $('#isUserCompany').attr('checked', false);
        $(".form-item-company, .form-item-vatNumber, .form-item-invoice-address-current-company, .form-item-invoice-address-current-vatNumber").hide();
    }

        });
    }

}

function setShppingAddress(id) {
    if (id == 0) {
        if ($(".isa_info")[0]) {
            $(".isa_info").remove();
        }
        $('#pccheckout-invoiceanddelivery-form #edit-shipping-detail-current-name').val('');
        $('#pccheckout-invoiceanddelivery-form #edit-shipping-detail-current-company').val('');
        $('#pccheckout-invoiceanddelivery-form #edit-shipping-detail-current-street').val('');
        $('#pccheckout-invoiceanddelivery-form #edit-shipping-detail-current-postalCode').val('');
        $('#pccheckout-invoiceanddelivery-form #edit-shipping-detail-current-city').val('');
        $('#pccheckout-invoiceanddelivery-form #edit-shipping-detail-current-country').val('');
    } else {
        var url = Drupal.settings.basePath + 'shipping/' + id;
        $.getJSON(url, function (data) {
            $('#pccheckout-invoiceanddelivery-form #edit-shipping-detail-current-name').val(data.name);
            $('#pccheckout-invoiceanddelivery-form #edit-shipping-detail-current-company').val(data.company);
            $('#pccheckout-invoiceanddelivery-form #edit-shipping-detail-current-street').val(data.street);
            $('#pccheckout-invoiceanddelivery-form #edit-shipping-detail-current-postalCode').val(data.postalCode);
            $('#pccheckout-invoiceanddelivery-form #edit-shipping-detail-current-city').val(data.city);
            $('#pccheckout-invoiceanddelivery-form #edit-shipping-detail-current-country').val(data.country);

        });
    }

}

})(jQuery);

function pccheckout_forgotpassword_callback() {
    jQuery.fancybox.close();
}

function pccheckout_picker_callback(pup) {

/*    jQuery('#pccheckout-checkout-form .pup').replaceWith(pup.html);
    jQuery('#pccheckout-checkout-form input[name="shipping[pickup][id]"]').val(pup.id);
    jQuery('#pccheckout-checkout-form input[name="shipping[pickup][country]"]').val(pup.countryCode);*/


    jQuery.fancybox.close();
}

var pccheckoutRequest;

function pccheckout_submit_form(form, triggeringElement) {
    var form = $('#pccheckout-login-form');
    jQuery('#pccheckout-checkout-form .payment .right').checkoutOverlay(jQuery('.overlay'));

    if (pccheckoutRequest) {
        pccheckoutRequest.abort();
    }

    var url = form.attr('action');
    var data = form.serialize();

    form.css('cursor', 'wait');

    if (triggeringElement) {
        data = '_triggering_element_name=' + triggeringElement.attr("name") + '&' + data;
    }

    data = data + '&op=ajax';

    pccheckoutRequest = jQuery.ajax({
        type: 'POST',
        url: url,
        data: data,
        success: function (data) {
            form.html(jQuery('#' + form.attr('id'), data).html());
            jQuery('#block-pccart-cart').html(jQuery('#block-pccart-cart', data).html());
            Drupal.attachBehaviors(form);
        },
        complete: function () {
            form.css('cursor', 'default');
        }
    });
}

function pccheckout_gateway_callback(url) {
    jQuery.fancybox.close();
    window.location = url;
}

function pccheckout_gateway_cancel(url) {
    jQuery.fancybox.close();
    history.go(-1);
}


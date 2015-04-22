(function ($) {

    $(".button_null_address_vat").live("click", function () {
        $('#light').hide();
        $('#fademe').hide();
        $("input[name='invoice[address][current][vatNumber][number]']").val('');
    });

    $("#isUserCompany").live('click', function () {
        if (this.checked) {
            $(".form-item-company, .form-item-vatNumber, .form-item-invoice-address-current-company, .form-item-invoice-address-current-vatNumber").show();
        } else {
            $(".form-item-company, .form-item-vatNumber, .form-item-invoice-address-current-company, .form-item-invoice-address-current-vatNumber").hide();

            $("#companyInput").val("");
            $("#vatNumber").val("");
        }
    });

    $(document).ready(function () {
        $(".selectBilling2").select2();
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
        attach: function (context, settings){
            
            
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
            jQuery('#pccheckout-invoiceanddelivery-form fieldset.tohiding').hide();
            var hash = location.hash;
            if (hash != "") {
                jQuery("#pccheckout-invoiceanddelivery-form fieldset.tohiding" + hash).show();
            }
            $('#pccheckout-invoiceanddelivery-form .summary .toggle').once().click(function () {
                var url = jQuery(this).attr('href');
                var target = url.substring(url.indexOf('#'));
                jQuery('form fieldset.tohiding').hide();
                jQuery(target).show();
                jQuery(".select2-display-none").hide();
            });

            $('#pccheckout-invoiceanddelivery-form .selectBilling2').on('change', function() {
                console.log("yes");
                setInvoiceAddress($(this).val());
            });

       
            $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-country').once().change(function (){
                var url = Drupal.settings.basePath + '?q=js/country/' + $(this).val();
                $.getJSON(url, null, function (data){
                    $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-vatnumber-country').val(data.vatPrefix).trigger('change');
                });
            });

        }
    }

    function setInvoiceAddress(id) {
            var url = Drupal.settings.basePath + 'invoceform/' + id;
            $.getJSON(url , function (data){
                $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-name').val(data.name);
                $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-street').val(data.street);
                $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-postalcode').val(data.postalCode);
                $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-city').val(data.city);
                $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-country').val(data.country);
                $('#pccheckout-invoiceanddelivery-form #companyInput').val(data.company);
                $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-vatnumber-country').val(data.iso);
                $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-vatnumber-number').val(data.vatNumber);
                //$('#pccheckout-invoiceanddelivery-form .form-item-invoice-address-vatNumber .number').trigger('change');
            });
    }
})(jQuery);

function pccheckout_forgotpassword_callback() {
    jQuery.fancybox.close();
}


function pccheckout_picker_callback(pup) {
    /*
     var picker = jQuery('#pccheckout-checkout-form .pup');
     jQuery('.id', picker).val(pup.id);
     jQuery('.country-code', picker).val(pup.countryCode);
     jQuery('.name', picker).html(pup.name);
     jQuery('.address', picker).html(pup.address  + '<br/>' + pup.postalCode + ' ' + pup.city);
     jQuery('.openinghours-container', picker).html(jQuery(pup.openingHours));
     Drupal.attachBehaviors(picker);
     
     picker.show();
     jQuery('#pccheckout-checkout-form .nopup').hide();
     */
    jQuery('#pccheckout-checkout-form .pup').replaceWith(pup.html);
    jQuery('#pccheckout-checkout-form input[name="shipping[pickup][id]"]').val(pup.id);
    jQuery('#pccheckout-checkout-form input[name="shipping[pickup][country]"]').val(pup.countryCode);


    jQuery.fancybox.close();
}


var pccheckoutRequest;

function pccheckout_submit_form(form, triggeringElement) {
    //var form = $('#pccheckout-login-form');


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
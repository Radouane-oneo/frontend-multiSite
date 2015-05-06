(function ($) {

    /* popup button annuler */
    $(".button_null_address_vat").live("click", function () {
        $('#light').hide();
        $('#fademe').hide();
        $("input[name='invoice[address][current][vatNumber][number]']").val('');
    });

    $(".valid-button-btt").live("click", function () {
        var number = $('#edit-invoice-address-current-vatnumber-number').val();
        var country = $('#edit-invoice-address-current-vatnumber-country').val();
        $('#fademe').removeClass('black_overlay2');
        $('#fademe').addClass('black_overlay');
        $.getJSON(Drupal.settings.basePath + 'index.php?q=/billingAccountVat/' + country + number, function (dataset) {
            $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-name').val(dataset.name);
            $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-street').val(dataset.street);
            $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-postalcode').val(dataset.postalCode);
            $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-city').val(dataset.city);
            $('#pccheckout-invoiceanddelivery-form #companyInput').val(dataset.company);
            $('#invoice-address input[type=text]').attr('readonly', true);
            $('#edit-invoice-address-current-country').attr('disabled', true);
        });
    });

    var UserCompany;

    /* display  vat & company input afther click box */
    $("#isUserCompany").live('click', function () {
        if (this.checked) {
            UserCompany = "yes";
            $(".form-item-company, .form-item-vatNumber, .form-item-invoice-address-current-company, .form-item-invoice-address-current-vatNumber").show();
        } else {
            UserCompany = "no";
            $(".form-item-company, .form-item-vatNumber, .form-item-invoice-address-current-company, .form-item-invoice-address-current-vatNumber").hide();
            $('#edit-invoice-address-current-vatnumber-number').removeClass('error');
            $('#companyInput').removeClass('error');
            $('#edit-invoice-address-current-vatnumber-country').removeClass('error');
        }
    });



    /* display  vat & company on load if adress is Company */
    $(document).ready(function () {

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

        $('#invoice-address input[type=text]').attr('readonly', true);
        $('#edit-invoice-address-current-country').attr('readonly', true);

        if ($('.selectBilling2').val() == 0) {
            $('#isUserCompany').attr('disabled', false);
        } else {
            $('#isUserCompany').attr('disabled', true);
        }

        if ($(".isa_info")[0]) {
            $(".isa_info").remove();
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
                       console.log('1');
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


                    var vat = 0.21;
                    var vatprice = myprice * vat;
                    var total = myprice + vatprice;
                    total = total.toFixed(2) + "";
                    var wholevat = total.split(".")[0];
                    var decPartvat = total.split(".")[1];
                    var End = '<span id="price" class="price"><label>Total HTVA</label><span class="value"><span class="whole">' + wholevat + '</span><span class="decimalpoint">,</span><span class="decimals">' + decPartvat + '</span>&nbsp;<span class="currency">€</span></span></span>';
                    $('.page-checkout-payment #edit-actions').find('#price').replaceWith(End);
                    
                   
                }

           });




            $('#pccheckout-invoiceanddelivery-form').submit(function (e) {

                var number = $('#edit-invoice-address-current-vatnumber-number');
                var company = $('#companyInput');
                if (UserCompany == "yes") {
                    if (number.val() == '' || company.val() == '') {
                        e.preventDefault();
                        $('#edit-invoice-address-current-vatnumber-number').addClass('error');
                        $('#companyInput').addClass('error');
                        $('#edit-invoice-address-current-vatnumber-country').addClass('error');

                    }
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
            /*  setInvoiceAddress from select  */
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

        }
    }

function setInvoiceAddress(id) {
    if (id == 0) {
        $('#isUserCompany').attr('disabled', false);
        $('#invoice-address input[type=text]').attr('readonly', false);
        $('#edit-invoice-address-current-country').attr('disabled', false);
        $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-name').val('');
        $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-street').val('');
        $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-postalCode').val('');
        $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-city').val('');
        $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-country').val(21);
        $('#pccheckout-invoiceanddelivery-form #companyInput').val('');
        $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-vatnumber-country').val('BE');
        $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-vatnumber-number').val('');
    } else {
        var url = Drupal.settings.basePath + 'invoceform/' + id;
        $.getJSON(url, function (data) {
        $('#invoice-address input[type=text]').attr('readonly', true);
        $('#edit-invoice-address-current-country').attr('readonly', true);
        $('#isUserCompany').attr('disabled', true);

        $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-name').val(data.name);
        $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-street').val(data.street);
        $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-postalCode').val(data.postalCode);
        $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-city').val(data.city);
        $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-country').val(data.country);

    if (data.vatNumber) {
        $('#isUserCompany').attr('checked', true);
        $(".form-item-company, .form-item-vatNumber, .form-item-invoice-address-current-company, .form-item-invoice-address-current-vatNumber").show();
        $('#pccheckout-invoiceanddelivery-form #companyInput').val(data.company);
        $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-vatnumber-country').val(data.iso);
        $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-vatnumber-number').val(data.vatNumber.substring(2));
    } else {
        $('#pccheckout-invoiceanddelivery-form #companyInput').val('');
        $('#pccheckout-invoiceanddelivery-form #edit-invoice-address-current-vatnumber-country').val('BE');
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
            if (data.vatStatus) {
                if (!$(".isa_info")[0]) {
                    $('.form-item-shipping-detail-current-select').before('<div class="isa_info">' + Drupal.t('Votre adresse de facturation sera l \' adresse de livraison') + '</div>');
                }
            } else {
                if ($(".isa_info")[0]) {
                    $(".isa_info").remove();
                }
            }
        });
    }

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


 jQuery(document).ready(function(e) {
     jQuery("#pcretour-form  #edit-number").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        var character = String.fromCharCode(e.keyCode);
        if (
        	"²&é\"'(-è_çà)=°+~#{[|`\\^@]}*^$ù!:;,¨£µ%§/.?¤<>".indexOf(character) != -1 ||
        	jQuery.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190, 20, 16]) !== -1 ||
             // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
             // Allow: Ctrl+C
            (e.keyCode == 67 && e.ctrlKey === true) ||
             // Allow: Ctrl+X
            (e.keyCode == 88 && e.ctrlKey === true) ||
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if (!e.altKey && !e.ctrlKey && (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            jQuery('#pcretour-form  #edit-number').parent().find('.errorMsg').remove();
            jQuery('#pcretour-form  #edit-number').parent().append('<div class="errorMsg">'+Drupal.t("number error")+'</div>');
            jQuery('#pcretour-form  #edit-number').addClass("error");
            e.preventDefault();
        }
        else{
            jQuery('#pcretour-form  #edit-number').removeClass("error");
            jQuery(".errorMsg").hide();
        }
    });
    jQuery("#pcretour-form #edit-postalcode").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        var character = String.fromCharCode(e.keyCode);
        if (
        	"²&é\"'(-è_çà)=°+~#{[|`\\^@]}*^$ù!:;,¨£µ%§/.?¤<>".indexOf(character) != -1 ||
        	jQuery.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190, 20, 16]) !== -1 ||
             // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
             // Allow: Ctrl+C
            (e.keyCode == 67 && e.ctrlKey === true) ||
             // Allow: Ctrl+X
            (e.keyCode == 88 && e.ctrlKey === true) ||
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if (!e.altKey && !e.ctrlKey && (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        	jQuery('#pcretour-form #edit-postalcode').parent().find('.errorMsg').remove();
            jQuery('#pcretour-form #edit-postalcode').parent().append('<div class="errorMsg">'+Drupal.t("number error")+'</div>');
            jQuery('#pcretour-form #edit-postalcode').addClass("error");
            e.preventDefault();
        }
        else{
            jQuery('#pcretour-form  #edit-postalcode').removeClass("error");
            jQuery(".errorMsg").hide();
        }
    });
    jQuery('#edit-jobid').click(function (e){
        var _this = jQuery(this); 
        var optionSelected = jQuery("option:selected", this);
        jQuery('#edit-numberboxselect').val(optionSelected.attr("data-box"));        
    });
    jQuery('#edit-submit').click(function (e){        
          jQuery('#content .complaintform .required').removeClass("error");
          jQuery(".errorMsg").hide();
          var errorField = false;
          if (jQuery('#edit-orderid').val().length  > 8){
              jQuery('#edit-orderid').addClass("error");
              jQuery('#edit-orderid').parent().append('<div class="errorMsg">'+Drupal.t("Fill in 8 digits without OR prefix")+'</div>');
              errorField = true;
          }
          if (jQuery('#edit-numberboxselect').val() > 20 ){   
              jQuery('#edit-numberboxselect').addClass("error");
              jQuery('#edit-numberboxselect').parent().append('<div class="errorMsg">'+Drupal.t("message erreur box max")+'</div>');
              errorField = true;
          }
          else{
              jQuery('#edit-numberboxselect').removeClass("error");
              jQuery(".errorMsg").hide();
              errorField = false;
          }
          jQuery('#content .complaintform .required').each(function() {//console.log(jQuery(this));
              var _this = jQuery(this);
              if(_this.val() == "" || _this.val() == 0) { 
                
                  _this.addClass("error");
                  _this.parent().append('<div class="errorMsg">'+Drupal.t("this field is required")+'</div>');
                  errorField = true;
              }          
          })
          if(jQuery('#edit-jobid').val() == null){
               errorField = true;
               jQuery('#edit-orderid').val('');
               jQuery('#edit-orderid').addClass("error");
               jQuery('#s2id_edit-jobid').addClass("error");
          }
          if (errorField)  
          {
            jQuery('html, body').animate({
                    scrollTop: jQuery("#edit-orderid").offset().top
                }, 800);
            e.stopPropagation();
            e.preventDefault();
          }
          else{
                                            
              jQuery('#box-progress').show();
              var rep = setInterval(function(){
                                                jQuery.get( "verifysend", function(data) {
                                                    if(data) {
                                                        jQuery('.complaintSuccess').show();
                                                        jQuery('#link_pdf').attr('href',data);
                                                        jQuery('#link_pdf').text(data);
                                                        jQuery('.complaintSubmit').hide();
                                                        clearInterval(rep);
                                                        jQuery('#box-progress').hide();
                                                    }
                                                })
                                            },1000)
              
            //  jQuery("#pccomplaint-form").submit();
//                jQuery("#pccomplaint-form .complaintSubmit").css({ "display":"none"});
//                jQuery(".complaintSuccess").css({ "display":"block"});
          }
      });
      
    jQuery("#edit-orderid").change(function(e){       
        actionComplaint(e, 'orderid');  
    });
    function actionComplaint(e, action){  
        jQuery('#edit-jobid').find('option').remove();
        jQuery('.select2-chosen').html('');
        jQuery('#content .complaintform .required').removeClass("error");
        jQuery("#edit-jobid").removeClass("error");
        jQuery(".errorMsg").hide();
        var span = document.getElementById("errorMsg");        
        if  (isNaN(jQuery('#edit-orderid').val()) || (jQuery('#edit-orderid').val() == '')){   
            span.innerText = '';
            txt = document.createTextNode(Drupal.t('messageErrorOrderId'));
            span.innerText = txt.textContent; 
            jQuery("#errorMsg").css({ "display":"inline-block"});
        }else if (jQuery('#edit-orderid').val().length > 8){
            jQuery('#edit-orderid').addClass("error");
            jQuery('#edit-orderid').parent().find('.errorMsg').remove();
            span.innerText = '';
            jQuery('#edit-orderid').parent().append('<div class="errorMsg">'+Drupal.t("Fill in 8 digits without OR prefix")+'</div>');             
        }
        else{
            jQuery("#errorMsg").css({ "display":"none"}); 
            var href = "retour/order/" + jQuery('#edit-orderid').val(); 
            jQuery('#box-progress').show();
            jQuery.ajax({           
                url: href,
                success: function(data){
                    
                    if (!data.id) 
                    {                          
                        displayerror();
                    }
                    else
                    {
                        if(data.orderStatus && [10, 18].indexOf(data.orderStatus.id)!= -1){
                            console.log(data.orderStatus.id);
                            jQuery('#box-progress').hide();
                            jQuery("#errorMsg").css({ "display":"none"});
                            jQuery('#edit-orderid').parent().find('.errorMsg').remove();
                            jQuery("#errorMsg").css({ "display":"none"});
                            jQuery("#edit-orderid").removeClass('error');                            
                            jQuery.each(data.orderItems, function(i,orderitem) {                                
                                if (!orderitem.discountId)
                                {
                                    jQuery("#edit-jobid").append(jQuery("<option>").attr("value", orderitem.id).attr("data-box", orderitem.tracking.length).text(orderitem.id));
                                }
                             });
                            jQuery('.select2-chosen').html(data.orderItems[0].id);
                            jQuery('#edit-numberboxselect').val(data.orderItems[0].tracking.length);
                            jQuery(".form-item-jobid .select2-chosen").find('option:eq(0)').prop('selected',true);
                            
                        }
                        else{
                            displayerror();
                        }
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    displayerror()
                   // e.preventDefault();
                }       
            });
        }
      }
      function displayerror(){
        var span = document.getElementById("errorMsg");
        jQuery('#box-progress').hide(); 
        jQuery('#edit-orderid').addClass("error");
        txt = document.createTextNode(Drupal.t('NotValidOrder'));
        span.innerText = txt.textContent; 
      //  jQuery("#errorUpload").text(Drupal.t('merci de remplir le numero de la commande')); 
        jQuery("#errorMsg").css({ "display":"inline"});
        jQuery('#errorMsg').focus(); 
      }
  
 });
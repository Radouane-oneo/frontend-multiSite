 jQuery(document).ready(function(e) {
    jQuery('#edit-submit').click(function (e){        
          jQuery('#content .complaintform .required').removeClass("error");
          jQuery(".errorMsg").hide();
          var errorField = false;
          if (jQuery('#edit-orderid').val().length  > 8){
              jQuery('#edit-orderid').addClass("error");
              jQuery('#edit-orderid').parent().append('<div class="errorMsg">'+Drupal.t("Fill in 8 digits without OR prefix")+'</div>');
          }
          jQuery('#content .complaintform .required').each(function() {
              var _this = jQuery(this);                
              if(_this.val() == "" || _this.val() == 0) {                   
                  _this.addClass("error");
                  _this.parent().append('<div class="errorMsg">'+Drupal.t("this field is requierd")+'</div>');
                  errorField = true;
              }
          })
          if (errorField)  
          {
              e.stopPropagation();
              e.preventDefault();
          }
      });
      
    jQuery("#edit-orderid").change(function(e){       
        actionComplaint(e, 'orderid');  
    });
    function actionComplaint(e, action){  
        jQuery('#content .complaintform .required').removeClass("error");
        jQuery(".errorMsg").hide();
        var span = document.getElementById("errorMsg");        
        if  (isNaN(jQuery('#edit-orderid').val()) || (jQuery('#edit-orderid').val() == '')){   
            span.innerText = '';
            txt = document.createTextNode(Drupal.t('messageErrorOrderId'));
            span.innerText = txt.textContent; 
            jQuery("#errorMsg").css({ "display":"inline"});
        }else if (jQuery('#edit-orderid').val().length > 8){
            jQuery('#edit-orderid').addClass("error");
            jQuery('#edit-orderid').parent().find('.errorMsg').remove();
            span.innerText = '';
            jQuery('#edit-orderid').parent().append('<div class="errorMsg">'+Drupal.t("Fill in 8 digits without OR prefix")+'</div>');             
        }
        else{
            jQuery("#errorMsg").css({ "display":"none"}); 
            var href = "complaint/order/" + jQuery('#edit-orderid').val(); 
            jQuery('#box-progress').show();
            //console.log(href);         
            
            jQuery.ajax({           
                url: href,
                success: function(){ 
                    jQuery('#box-progress').hide();
                    jQuery("#errorMsg").css({ "display":"none"});
                    console.log('success');
                    jQuery('#edit-orderid').parent().find('.errorMsg').remove();
                    jQuery("#errorMsg").css({ "display":"none"});
                    jQuery("#edit-orderid").removeClass('error');
                    if (action == 'submit'){
                        jQuery("#pccomplaint-form").submit();
                        jQuery("#pccomplaint-form .complaintSubmit").css({ "display":"none"});
                        jQuery(".complaintSuccess").css({ "display":"block"});
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    jQuery('#box-progress').hide(); 
                    jQuery('#edit-orderid').addClass("error");
                    txt = document.createTextNode(Drupal.t('NotValidOrder'));
                    span.innerText = txt.textContent; 
                  //  jQuery("#errorUpload").text(Drupal.t('merci de remplir le numero de la commande')); 
                    jQuery("#errorMsg").css({ "display":"inline"});
                    jQuery('#errorMsg').focus(); 
                   // e.preventDefault();
                }       
            });
        }
      }
  
 });
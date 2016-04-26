 jQuery(document).ready(function(e) {
    Dropzone.autoDiscover = false;      
    jQuery("#dZUpload").dropzone({        
        addRemoveLinks: true,  
        removedfile: function(file) {
            var name = file.name;        
            jQuery.ajax({
                type: 'POST',
                url: 'complaintdeleteimage',                
                data: {file: name, idorder: jQuery('#edit-orderid').val()},
                dataType: 'html'
            });
            var _ref;
            return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;        
        },
                      
        acceptedFiles: "image/jpg,image/jpeg",
        maxFiles: 5,
        maxFilesize: 5, 
        sending: function(file, xhr, formData) {
            formData.append("orderID", jQuery('#edit-orderid').val());
        },
        url: "complaintupload",        
        success: function (file, response) {
            console.log("Successfully uploaded :" , response);            
            if(response == 'false') {
                jQuery("#errorUpload").text('MessageErrorImage');
            } else {
                jQuery("#errorUpload").text(Drupal.t('good'));    
            }
        },
        error: function (file, response) {
            jQuery("#errorUpload").text(Drupal.t('good'));
            jQuery(file.previewElement).hide();
        }
    });    
    if (jQuery('#edit-orderid').val() == '' || isNaN(jQuery('#edit-orderid').val()) || jQuery('#edit-orderid').val().length > 8){
        jQuery('.dropzoneupload').click(function(){
              jQuery("#errorUpload").html("<span style='color:red'>"+Drupal.t('merci de remplir le numero de la commande')+"</span>");
              jQuery('#edit-orderid').focus();
        });
        Dropzone.instances[0].disable(); 
    }    
    jQuery("#edit-submit").click(function(e){        
        if (jQuery('#dZUpload').hasClass('dz-started'))
        {
            actionComplaint(e,'submit');           
        }
        else{
            jQuery("#errorUpload").show();
            jQuery("#errorUpload").html("<span style='color:red'>"+Drupal.t('image requierd')+"</span>");
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
        span.innerText = '';
        if  (isNaN(jQuery('#edit-orderid').val()) || (jQuery('#edit-orderid').val() == '')){ 
            jQuery('#edit-orderid').addClass("error");
            txt = document.createTextNode(Drupal.t('messageErrorOrderId'));
            span.innerText = txt.textContent;  
            Dropzone.instances[0].disable();
          //  jQuery("#errorUpload").text(Drupal.t('merci de remplir le numero de la commande')); 
            jQuery("#errorMsg").css({ "display":"inline"});
            e.stopPropagation();
            e.preventDefault();
        }else if (jQuery('#edit-orderid').val().length > 8){
            jQuery("#errorMsg").css({ "display":"none"});
            jQuery('#edit-orderid').addClass("error");
            jQuery('#edit-orderid').parent().append('<div class="errorMsg">'+Drupal.t("Fill in 8 digits without OR prefix")+'</div>');
        }
        else{
            jQuery("#errorMsg").css({ "display":"none"}); 
            var href = "complaint/order/" + jQuery('#edit-orderid').val(); 
            jQuery('#box-progress').show();
            jQuery.ajax({           
                url: href,
                success: function(){
                    jQuery('#box-progress').hide();
                    jQuery("#errorMsg").css({ "display":"none"});
                    jQuery("#edit-orderid").removeClass('error');
                    Dropzone.instances[0].enable();
                    console.log('success');
                    jQuery("#errorUpload").css({ "display":"none"});
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
                    Dropzone.instances[0].disable();
                  //  jQuery("#errorUpload").text(Drupal.t('merci de remplir le numero de la commande')); 
                    jQuery("#errorMsg").css({ "display":"inline"});
                    jQuery('#errorMsg').focus(); 
                   // e.preventDefault();
                }       
            });
        }
      }
  
 });



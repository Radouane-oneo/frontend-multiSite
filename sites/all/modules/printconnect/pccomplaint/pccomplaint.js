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
                jQuery("#errorUpload").text('good');    
            }
        },
        error: function (file, response) {
            jQuery("#errorUpload").text('not good');
            jQuery(file.previewElement).hide();
        }
    });    
    if (jQuery('#edit-orderid').val() == ''){
        Dropzone.instances[0].disable();
      //  jQuery("#errorUpload").text(Drupal.t('merci de remplir le numero de la commande')); 
    }    
    jQuery("#edit-submit").click(function(e){        
        actionComplaint(e,'submit');  
    });
    jQuery("#edit-orderid").change(function(e){       
        actionComplaint(e, 'orderid');  
    });
    function actionComplaint(e, action){       
        var span = document.getElementById("errorMsg");
        if  (isNaN(jQuery('#edit-orderid').val()) || (jQuery('#edit-orderid').val() == '')){             
            txt = document.createTextNode(Drupal.t('messageErrorOrderId'));
            span.innerText = txt.textContent;  
            Dropzone.instances[0].disable();
          //  jQuery("#errorUpload").text(Drupal.t('merci de remplir le numero de la commande')); 
            jQuery("#errorMsg").css({ "display":"inline"});
        }
        else{
            jQuery("#errorMsg").css({ "display":"none"}); 
            var href = "complaint/order/" + jQuery('#edit-orderid').val(); 
            console.log(href);
            jQuery.ajax({           
                url: href,
                success: function(){ 
                    jQuery("#errorMsg").css({ "display":"none"});
                    Dropzone.instances[0].enable();
                    console.log('success');
                    if (action == 'submit'){
                        jQuery("#pccomplaint-form").submit();
                        jQuery("#pccomplaint-form .complaintSubmit").css({ "display":"none"});
                        jQuery(".complaintSuccess").css({ "display":"block"});
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
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



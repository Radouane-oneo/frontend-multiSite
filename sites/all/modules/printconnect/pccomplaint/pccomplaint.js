 jQuery(document).ready(function(e) {
 Dropzone.autoDiscover = false;
 
    jQuery("#dZUpload").dropzone({
        acceptedFiles: "image/jpg,image/jpeg",
        maxFiles: 5,
        maxFilesize: 5,
        url: "complaintupload",
        addRemoveLinks: true,
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
    jQuery("#edit-submit").click(function(e){        
        actionComplaint(e);  
    });
    jQuery("#edit-orderid").change(function(e){
        actionComplaint(e);  
    });
    function actionComplaint(e){
        e.preventDefault();
        var span = document.getElementById("errorMsg");
        if  (isNaN(jQuery('#edit-orderid').val()) || (jQuery('#edit-orderid').val() == '')){             
            txt = document.createTextNode(Drupal.t('messageErrorOrderId'));
            span.innerText = txt.textContent;            
            jQuery("#errorMsg").css({ "display":"inline"});
            jQuery('#errorMsg').focus();   
        }
        else{
            jQuery("#errorMsg").css({ "display":"none"}); 
            var href = "complaint/order/" + jQuery('#edit-orderid').val(); 
            jQuery.ajax({           
                url: href,
                success: function(){ 
                    jQuery("#errorMsg").css({ "display":"none"}); 
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    txt = document.createTextNode(Drupal.t('NotValidOrder'));
                    span.innerText = txt.textContent;  
                    jQuery("#errorMsg").css({ "display":"inline"});
                    jQuery('#errorMsg').focus(); 
                }       
            });
        }
      }
  
 });



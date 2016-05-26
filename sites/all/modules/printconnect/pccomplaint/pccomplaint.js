 jQuery(document).ready(function(e) {
    Dropzone.autoDiscover = false;  
    Dropzone.autoQueue = false;
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
        maxfilesexceeded: function(file)
        {
        console.log('You have uploaded more than 5 Image5. Only the first file will be uploaded!');
        }, 
        sending: function(file, xhr, formData) {
            formData.append("orderID", jQuery('#edit-orderid').val());   
        },
        url: "complaintupload",        
        success: function (file, response) {
            console.log("Successfully uploaded:" , response); 
          
            if(response == 'false') {
                jQuery("#errorUpload").text('MessageErrorImage');
                jQuery("#errorUpload").show();
            } else {
                jQuery("#errorUpload").text(Drupal.t('success upload image'));
                jQuery("#errorUpload").show();
            }
        },
        error: function (file, response) {
            jQuery("#errorUpload").html("<span style='color:red'>"+Drupal.t(response)+"</span>");
            jQuery("#errorUpload").show();
            jQuery(file.previewElement).hide();
        }
    });    
    
        jQuery('.dropzoneupload').click(function(){
            if (   (jQuery('#edit-orderid').val() == '') ||
            isNaN(jQuery('#edit-orderid').val()) || 
            jQuery('#edit-orderid').val().length > 8){
              jQuery("#errorUpload").html("<span style='color:red'>"+Drupal.t('merci de remplir le numero de la commande')+"</span>");
              jQuery('#edit-orderid').focus();
              if(Dropzone.instances[0]) Dropzone.instances[0].disable(); 
    }   
        });
         
    jQuery("#edit-submit").click(function(e){        
        jQuery('#content .complaintform .required').removeClass("error");
        jQuery(".errorMsg").hide();
        var errorField = false;
        if (jQuery('#edit-orderid').val().length  > 8){
            jQuery('#edit-orderid').addClass("error");
            jQuery('#edit-orderid').parent().append('<div class="errorMsg">'+Drupal.t("Fill in 8 digits without OR prefix")+'</div>');
            errorField = true;
        }
        jQuery('#content .identification .required').each(function() {//console.log(jQuery(this));
            var _this = jQuery(this);
            if(_this.val() == "" || _this.val() == 0) {                   
                _this.addClass("error");
                _this.parent().append('<div class="errorMsg">'+Drupal.t("this field is requierd")+'</div>');
                errorField = true;
            }          
         })
        if (errorField)  
        {
            jQuery('html, body').animate({
                        scrollTop: jQuery("#edit-orderid").offset().top
                    }, 800);
            e.stopPropagation();
            e.preventDefault();
        }
              
        if ((jQuery('.dz-processing').length) || (jQuery('#edit-complainttype').val() == 0) || (jQuery('#edit-complainttype').val() == 3))
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
            if(Dropzone.instances[0]) Dropzone.instances[0].disable();
          //  jQuery("#errorUpload").text(Drupal.t('merci de remplir le numero de la commande')); 
            jQuery("#errorMsg").css({ "display":"inline-block"});
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
                success: function(data){
                    
                    if (!data.id) 
                    {                          
                        displayerror();
                    }
                    else
                    {
                        if(data.orderStatus && [10, 18].indexOf(data.orderStatus.id)!= -1){
                            console.log(data.orderStatus.id);
                            if(Dropzone.instances[0]) Dropzone.instances[0].enable();
                            jQuery("#errorUpload").css({ "display":"none"});
                            jQuery('#box-progress').hide();
                            jQuery("#errorMsg").css({ "display":"none"});
                            jQuery('#edit-orderid').parent().find('.errorMsg').remove();
                            jQuery("#errorMsg").css({ "display":"none"});
                            jQuery("#edit-orderid").removeClass('error'); 
                            jQuery("#edit-jobid").empty();
                            jQuery.each(data.orderItems, function(i,orderitem) {                                
                                if (!orderitem.discountId)
                                {
                                  jQuery("#edit-jobid").append(jQuery("<option>").attr("value", orderitem.id).attr("data-box", orderitem.tracking.length).text(orderitem.id));
                                }
                             });
                            jQuery('.form-item-jobid .select2-chosen').html(data.orderItems[0].id);
                            jQuery("#s2id_edit-jobid .select2-chosen").find('option:eq(0)').prop('selected',true);
                            if (action == 'submit'){
                                jQuery("#pccomplaint-form").submit();
                                jQuery("#pccomplaint-form .complaintSubmit").css({ "display":"none"});
                                jQuery(".complaintSuccess").css({ "display":"block"});
                            }                            
                        }
                        else{
                            displayerror();
                        }
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    jQuery('#box-progress').hide();
                    //jQuery('#edit-orderid').addClass("error");
                    //txt = document.createTextNode(Drupal.t('NotValidOrdercoco'));
                    //span.innerText = txt.textContent; 
                    if(Dropzone.instances[0]) Dropzone.instances[0].disable();
                  //  jQuery("#errorUpload").text(Drupal.t('merci de remplir le numero de la commande')); 
                    jQuery("#errorMsg").css({ "display":"inline"});
                    jQuery('#errorMsg').focus(); 
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



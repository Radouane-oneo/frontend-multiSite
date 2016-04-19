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
                jQuery("#errorUpload").text('not good');
            } else {
                jQuery("#errorUpload").text('good');    
            }
        },
        error: function (file, response) {
             jQuery("#errorUpload").text('not good');
          jQuery(file.previewElement).hide();
        }
    });
    jQuery("#edit-orderid").change(function(){
        var href = "complaint/order/" + jQuery(this).val(); 
        console.log('mmmmm');
//      var  id = $(this).attr('id');
//      var wopper = '#pccart-cart-form #' + id  ;
        jQuery.getJSON(href, function(data){console.log('oooooo');
         if(!data){
             
            jQuery(".identification .errorMsg").css({ "display":"bloc"});
         }else{
             jQuery(".identification .errorMsg").css({ "display":"none"});
         }
        });
      });
 });


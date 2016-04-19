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
//      var  id = $(this).attr('id');
//      var wopper = '#pccart-cart-form #' + id  ;
        jQuery.getJSON(href, function(data){
         if(!data){
         jQuery(wopper).css({ "border":"1px solid red"});
         }else{
              jQuery(wopper).css({ "border":"1px solid #77b800"});
         }
        });
      });
 });


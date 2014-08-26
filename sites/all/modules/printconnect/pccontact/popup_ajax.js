/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

 
    
jQuery(document).ready(function () {
   
    jQuery("#pccontact_popup_form").submit(function(e) {
        alert("test");
        jQuery.ajax({
            type: 'POST',
            url: Drupal.settings.basePath + 'frfr/popup/ajax',
            //contentType: "application/json",
           // dataType: 'json',
            success: my_module_example,
            data: 'js=1&my_module_post_data=2012'
        });
     return false;
    });  
   function my_module_example(data) {
    alert(data.msg);
  }
});

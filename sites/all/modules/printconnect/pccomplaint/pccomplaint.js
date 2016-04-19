/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function ($){
	document.ready(function () {
		// Verification JS pour le formulaire complaint.
		jQuery('.complaintSubmit input.ui-button').click(function (){
			console.log('coco');
			jQuery('#content .complaintform .required').removeClass("error");
			jQuery(".errorMsg").hide();

			jQuery('#content .complaintform .required').each(function(i, elem) {
				var _this = $(this); 

				if(_this.val() == "" || _this.val() == 0) {
					e.preventDefault();

					_this.addClass("error");
					_this.siblings(".errorMsg").show();
				};
			})
			
		});

	});
})(jQuery);
jQuery(window).load(function(){
	jQuery(".details .image").each(function(i, elem) {
	  		var maxHeight = jQuery(this).height();
			jQuery(this).siblings(".description").css("height" , maxHeight+"px");    		
	}); 
});

jQuery(window).load(function(){
	jQuery(".details .image").each(function(i, elem) {
	  		var maxHeight = jQuery(this).height();
	  		var DescHeight = jQuery(this).siblings(".description").height();

	  		if ( maxHeight > DescHeight ) {
	  			jQuery(this).siblings(".description").css("height" , maxHeight+"px"); 
	  		} else {
	  			jQuery(this).siblings(".description").css("height" , DescHeight+"px"); 
	  		}			   		
	}); 
});

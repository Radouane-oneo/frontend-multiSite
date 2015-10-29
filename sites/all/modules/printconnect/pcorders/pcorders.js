jQuery(document).ready(function(){
	jQuery(".details .image").each(function(i, elem) {
		jQuery(elem).find(".image img").load(function(){
	  		var maxHeight = jQuery(elem).find(".image").height();
			jQuery(elem).find(".details .item .description").css("height" , maxHeight+"px");
		});     		
	}); 
});

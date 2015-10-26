$(document).ready(function(){
	$(".details .image").each(function(i, elem) {
		$(elem).find(".image img").load(function(){
	  		var maxHeight = $(elem).find(".image").height();
			$(elem).find(".details .item .description").css("height" , maxHeight+"px");
		});     		
	}); 
});

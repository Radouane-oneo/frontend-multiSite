

jQuery(document).ready(function(e) {

	function sameheight(s1,s2){
		jQuery(""+s1+"").each(function(i){

			var maxHeight = Math.max.apply(null, jQuery(" "+ s1 +":eq("+i+") "+s2+"").map(function ()
			{
				return jQuery(this).height();
			}).get());

			jQuery(" "+ s1 +":eq("+i+") "+s2+"").css("height",maxHeight);
		});
	}

	sameheight(".flyerstrap .main-page .block2-2-2", "div.detail-info");
	sameheight(".flyerstrap .main-page .block2-4","div.sameHeight");
	sameheight(".flyerstrap .main-page .block3-3","div.sameHeight");
	sameheight(".flyerstrap .main-page .blockProd-3col","div.prod-col > h3");
	sameheight(".flyerstrap .main-page .blockProd-3col","div.sameHeight");
	sameheight(".flyerstrap .main-page .blockProd-4col","div.prod-col > h3");
	sameheight(".flyerstrap .main-page .blockProd-4col","div.sameHeight");
	sameheight(".flyerstrap .main-page .block6-6-2col","div.sameHeight");
	sameheight(".flyerstrap .main-page .block6-6-3col","div.sameHeight");
	sameheight(".flyerstrap .main-page .block4-4","div.sameHeight");
	sameheight(".flyerstrap .main-page .blockProd-6col .prod-3col","div.prod-col > h3");

});






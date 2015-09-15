function chooseMarker(id) {
    var id = id;
    var func = 'parent.' + Drupal.settings.callback + '(id)';
    eval(func);
    parent.jQuery.fancybox.close();
    return false;
}

(function($) {
    Drupal.behaviors.pcflyerstore_map = {
        detach: function(context) {

        },
        attach: function(context, settings) {
	var torun = 1;
	$("#map-selector").bind("keypress", function(e) {
              if (e.keyCode == 13) {
                 $( "#btnsearch" ).trigger( "click" );
		return false;
              }
        });
	$('#btnsearch').click(function() {
	    if ($('#map-selector').val().length > 0) {
	    $('#map-selector').css('border-color', '');
	    var postalCodes = $.parseJSON($('#zipcod').html());
	    var citiesLocation = $.parseJSON($('#location').html());
	    var input = $('#map-selector').val();
	    var previousTop = $('#items_').attr('top');
	    if (input.length > 0) {
	       $('#items_').css('top', '0px');
	    } else {
		$('#items_').css('top', previousTop);
	    }
	    var attr = 'city';
	    if ($.isNumeric($('#map-selector').val())) {
		var attr = 'postalCode';
	    }
 	    $('#items_ li').each(function() {
	        if ($(this).find('span').attr(attr).toLowerCase().indexOf(input.toLowerCase()) < 0) {
		  $(this).css('display', 'none');
		} else {
		  $(this).css('display', '');
		}
	    });
	    if ($('#items_ li:not(:hidden)').length == 0 && attr == 'postalCode') {
	       $.each(postalCodes, function(code, Bposition) {
		   if (input == code) {
			console.log('yess '+Bposition);
			var targetPosition = Bposition.split('_');
			var latLng = new google.maps.LatLng(targetPosition[0], targetPosition[1]); // returns LatLng object
                        map.setCenter(latLng);
			map.setZoom(10);
			auZommMap();
		   }
	       }); 
	    } else if ($('#items_ li:not(:hidden)').length == 0 && attr == 'city') {
		$.each(citiesLocation, function(code, cityposition) {
                   if (input.toLowerCase() == code.toLowerCase()) {
                        var targetPosition = cityposition.split('_');
                        var latLng = new google.maps.LatLng(targetPosition[0], targetPosition[1]); // returns LatLng object
                        map.setCenter(latLng);
			map.setZoom(10);
			auZommMap();
                   }
               });
	    } else if ($('#items_ li:not(:hidden)').length > 0) {
		var duplicatePosition = [];
		$('#items_ li:not(:hidden)').each(function(){
		    var po = $(this).find('span').attr('po');
		   if ($('#items_ li span[po='+po+']:not(:hidden)').length > 1) {
			$('#items_ li span[po='+po+']:not(:hidden)').parents('li').last().hide();
		   }    
		});

		var bounds = new google.maps.LatLngBounds();
		var closestMarker = [];
		$('#items_ li:not(:hidden)').each(function(){
		    var positions = $(this).find('.place').attr('position');
		    positions = positions.split('_');
	            var latLng = new google.maps.LatLng(positions[1], positions[0]);
		    var distance = google.maps.geometry.spherical.computeDistanceBetween(latLng, map.getCenter());
		    bounds.extend(latLng);
		});
		map.fitBounds(bounds);
		for (var j=0; j < markerObjects.length ; j++) {
		    var distance = google.maps.geometry.spherical.computeDistanceBetween( markerObjects[j].getPosition(), map.getCenter());
		    closestMarker.push({'id':parseFloat(distance),'value': markerObjects[j].getPosition()});
   		}
		closestMarker.sort(function(a, b){return a.id-b.id});
		bounds = new google.maps.LatLngBounds();
		for(var j=0; j < 10; j++) {
    		    bounds.extend(closestMarker[j].value);
		}
		map.fitBounds(bounds);
	      }
	    } else {
		$('#items_ li').each(function() {
                  $(this).css('display', '');
                });
		$('#map-selector').css('border-color', 'red');
		var pos = new google.maps.LatLng(50.503887, 4.509936);
		map.setCenter(pos);
		map.setZoom(7);
	    }
	});
	function auZommMap() {
                var bounds = new google.maps.LatLngBounds();
                var closestMarker = [];
		var objecttarget = $('#items_ li');
		if ($('#items_ li:not(:hidden)').length > 0) {
		    objecttarget = $('#items_ li:not(:hidden)');
		}
                objecttarget.each(function(){
                   var positions = $(this).find('.place').attr('position');
                   positions = positions.split('_');
                   var latLng = new google.maps.LatLng(positions[1], positions[0]);
                   var distance = google.maps.geometry.spherical.computeDistanceBetween(latLng, map.getCenter());
		   if ($('#items_ li:not(:hidden)').length > 0) {
		        bounds.extend(latLng);
		   }
                   
                });
		if ($('#items_ li:not(:hidden)').length > 0) {
                    map.fitBounds(bounds);
		}
                for (var j=0; j < markerObjects.length ; j++) {
                    var distance = google.maps.geometry.spherical.computeDistanceBetween( markerObjects[j].getPosition(), map.getCenter());
                    closestMarker.push({'id':parseFloat(distance),'value': markerObjects[j].getPosition()});
                }
                closestMarker.sort(function(a, b){return a.id-b.id});
                bounds = new google.maps.LatLngBounds();
                for(var j=0; j < 10; j++) {
                    bounds.extend(closestMarker[j].value);
                }
                map.fitBounds(bounds); 

	}
        var targetStore;
        var map;
	var markers;
	var markerObjects =[];
	var infoWindowContent;
	var openInfoWindow  =false;
        var mapOptions = {
              center: new google.maps.LatLng(50.503887, 4.509936),
              zoom: 7
            };
            var infos = $.parseJSON($('#jsonContainer').html());
            function fillMarkers() {
                var markerData = new Array();
                $.each(infos.data, function(i, item) {
                    if (item.longitude != null && item.latitude != null) {
                        var obj = [item.name, item.longitude, item.latitude, item.postalCode, item.id, item.address];
                        markerData.push(obj);
                    }
                });
                return markerData;
            }
	    $('.pcflyerstores-store-link').live('click', function(){
		return false;
	    });
	    $('.pcflyerstores-store-link').live('mousedown', function(){
		var ids = $(this).find('.place').attr('id').split('_');
		console.log(ids);
               if (openInfoWindow) openInfoWindow.close();
               google.maps.event.trigger(markerObjects[$(this).find('.place').attr('po')], 'click');
		return false;
	    });
	    
	    $('.pcflyerstores-store-link').live('mouseover', function(){
		var position = $(this).find('.place').attr('position').split('_');
                var latLng = new google.maps.LatLng(position[1], position[0]); // returns LatLng object
                google.maps.event.trigger(markerObjects[$(this).find('.place').attr('po')], 'mouseover');
		if (torun == 1) {
                    map.setZoom(10);
                    map.setCenter(latLng);
		}
	    });
	   
	    $('.pcflyerstores-store-link').mouseout(function(){
                var position = $(this).find('.place').attr('position').split('_');
                var latLng = new google.maps.LatLng(position[1], position[0]); // returns LatLng object
                google.maps.event.trigger(markerObjects[$(this).find('.place').attr('po')], 'mouseout');
            });
 
            $('.zoneaccordion').click(function(){
                $("#postal-selector").val($(this).attr('postalcode'));
                jQuery("#BttSearch").trigger("mousedown");
            });
            
            function fillInfosWindows() {
                data = infos.data;
                var infoWindowContents = new Array();
                $.each(data, function(id, store) {
                    if (store.longitude != null && store.latitude != null) {
                        var info = '';
                        if (store.address != null) {
                            info = store.address;
                        }
			var txtBtn = '';
			if ($('#pcflyerstores-picker-form').length > 0) {
			   if (store.vacations != null ) {
			        var vacations = store.vacations[0];
				var startDate = new Date(vacations.startDate);
				var endDate = new Date(vacations.endDate);
				var currentDate = new Date($('#cartDate').html());
				console.log('startDate is :'+startDate);
				console.log('endDate is :'+endDate);
				console.log('cu is '+currentDate);
				if (currentDate.getTime() >= startDate.getTime() && endDate.getTime() >= currentDate.getTime()) {
				    txtBtn =  '<p style="text-align: right;  margin: 10px 0 0; width: 231px;"><img style="height: 34px; float:left; margin-right:10px; width:auto;" src="/sites/all/modules/printconnect/pcflyerstores/images/logo.png"><a href="/flyerstores/'+id+'" ><span class="Slink">'+$('#storeLink').html()+'</span></a></p>';
				} else {
	     			    txtBtn =  '<p style="text-align: right;  margin: 10px 0 0; width: 231px;"><img style="height: 34px; float:left; width:auto; margin-right:10px;" src="/sites/all/modules/printconnect/pcflyerstores/images/logo.png"><a href="/flyerstores/'+id+'" target="blank"><span class="Slink">'+$('#storeLink').html()+'</span></a></p>'+
                                '<p><a href="/stores/'+id+'" onClick="chooseMarker('+id+');return false" class="pcstores-store-link button jquery-once-1-processed ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" id="'+id+'" role="button"><span class="ui-button-text">'+$('#selectStore').html()+'</span></a></p>';
				}
			    } else {
				txtBtn =  '<p style="text-align: right; width:auto; margin: 10px 0 0; wwidth: 231px;"><img style="height: 34px; float:left; width:auto;  margin-right:10px;" src="/sites/all/modules/printconnect/pcflyerstores/images/logo.png"><a href="/flyerstores/'+id+'" target="blank"><span class="Slink">'+$('#storeLink').html()+'</span></a></p>'+
                                '<p><a href="/stores/'+id+'" onClick="chooseMarker('+id+');return false" class="pcstores-store-link button jquery-once-1-processed ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" id="'+id+'" role="button"><span class="ui-button-text">'+$('#selectStore').html()+'</span></a></p>';
			    }
			} else {
			   txtBtn =  '<p style="text-align: right; width:auto; margin: 10px 0 0; width: 231px;"><img style="height: 34px;width:auto; float:left; margin-right:10px" src="/sites/all/modules/printconnect/pcflyerstores/images/logo.png"><a href="/flyerstores/'+id+'" ><span class="Slink">'+$('#storeLink').html()+'</span></a></p>';
			}
			var pr = '<table style="width:100%; font-size: 10px;"><tbody style="background-color:transparent">';
			var faxtext = "";
                        if (store.fax != 'NAN' && store.fax != '' && store.fax.length > 2) {
                            faxtext = '<p style="overflow:hidden; text-align: left; margin: 0px;"><img style="margin: 0; float:left" src="/sites/all/themes/printconnect/flyer/print.jpg"><strong style="margin-left: 10px;  float: left; line-height: 15px; color: #6f6f6f; font-weight: normal;">'+store.fax+'</strong></p>';
                        }
                        $.each(store.openingHours, function(i, item) {
			    if (item != '') {
                                pr += '<tr><td style="border-bottom:1px solid grey; text-align:left"><span style="color:#f60">'+i+'</span> : </td><td style="text-align:right ;border-bottom:1px solid grey"><span style="color: #6f6f6f;">'+item+'</span></td></tr>';
			    }
                        });
                        pr += '</tbody></table>';
			var obj = ['<div style="max-width:245px;"class="info_content">' +
                                '<img src="/sites/all/modules/printconnect/pcflyerstores/images/store-item.png" style="float: left; margin-right: 5px; margin-bottom: 5px;"><h3 style="font-weight: bold;line-height: 15px; margin-bottom: 5px;">' + store.name + '</h3>' +
                                '<p style="margin: 0 0 2px;clear:both;">' + info + '</p>' +
				'<p style="overflow:hidden; text-align: left; margin: 0px; clear:both;"><img style="margin: 0; float:left" src="/sites/all/themes/printconnect/flyer/phone.jpg"><strong style="margin-left: 10px; float: left; line-height: 15px; color: #6f6f6f; font-weight: normal;">'+store.phone+'</strong></p>'+
				'<p style="overflow:hidden; text-align: left; margin: 0px;"><img style="margin: 0; float:left" src="/sites/all/themes/printconnect/flyer/mail.jpg"><strong style="margin-left: 10px;  float: left; line-height: 15px; color: #6f6f6f; font-weight: normal; color:#ff6500;">'+store.email+'</strong></p>'+
				faxtext+
				pr + txtBtn +				
                                '</div>'
                        ];
                        infoWindowContents.push(obj);
                    }
                });
                return infoWindowContents;
            }
            
            function toggleBounce(marker) {
                if (marker.getAnimation() != null) {
                  marker.setAnimation(null);
                } else {
                  marker.setAnimation(google.maps.Animation.BOUNCE);
                }
            }
            
            function simpleMap() {
		$('#Mapimg').css('height', '300px').css('width','400px');
		try{
			var simplePosition = $('#Mapimg').attr('position').split('_');
		}catch(e){
		}

		var mapOptions = {
    			zoom: 10,
    			center: new google.maps.LatLng(simplePosition[1], simplePosition[0])
  		}
		var image = '/sites/all/themes/printconnect/flyer/store.png';
		  var map = new google.maps.Map(document.getElementById('Mapimg'),
                                mapOptions);

  		var myLatLng = new google.maps.LatLng(simplePosition[1], simplePosition[0]);
  		var beachMarker = new google.maps.Marker({
      			position: myLatLng,
      			map: map,
			icon: image
  		});
            }
            
            function initialize() {
		$('#map-canvas').parent().css('height', '100%');
                var bounds = new google.maps.LatLngBounds();
                map = new google.maps.Map(document.getElementById("map-canvas"),
                    mapOptions);
                markers = fillMarkers();
		
                infoWindowContent = fillInfosWindows();
                // Loop through our array of markers & place each one on the map  
                for (var i = 0; i < markers.length; i++) {
                    var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
                    bounds.extend(position);
		    var infoWindow = new google.maps.InfoWindow();
                    var image = '/sites/all/themes/printconnect/flyer/store.png';
                    var marker = new google.maps.Marker({
                        position: position,
                        map: map,
                        title: markers[i][0],
                        icon: image,
                        animation: google.maps.Animation.DROP
                    });
                    marker.postalCode = markers[i][3];
		    marker.myposition = i;
		    google.maps.event.addListener(infoWindow,'closeclick',function(){
   			torun = 1; //removes the marker
   // then, remove the infowindows name from the array
		     });
                    // Allow each marker to have an info window    
                    google.maps.event.addListener(marker, 'click', (function(marker, i) {
                        return function() {
		            torun = 0;
			    openInfoWindow  = infoWindow;
                            infoWindow.setContent(infoWindowContent[i][0]);
                            infoWindow.open(map, marker);
			}
                    })(marker, i));
		    
		    google.maps.event.addListener(marker, 'mouseout', (function(marker, i) {
                        return function() {
                            marker.setIcon('/sites/all/themes/printconnect/flyer/store.png');
			}
                    })(marker, i));	
		    google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
                        return function() {
                            marker.setIcon('/sites/all/themes/printconnect/flyer/store2.png');
                        }
                    })(marker, i));
		    markerObjects[i] = marker;
                   // map.fitBounds(bounds);
                }
            }
	    if ($('#map-canvas').length > 0) {
		google.maps.event.addDomListener(window, 'load', initialize);	
	    } else {
		google.maps.event.addDomListener(window, 'load', simpleMap);
	    }
        }
    };
})(jQuery);


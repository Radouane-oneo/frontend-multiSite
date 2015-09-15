(function ($) {
 

  Drupal.behaviors.pcbpost_picker_form = {
    detach: function (context) {

    },
    attach: function (context, settings) {

      $('form').ajaxStart(function(){
        $(this).css('cursor', 'progress');
      });

      $('form').ajaxStop(function(){
        $(this).css('cursor', 'default');
      });


      $('form input', context).keypress(function (e) {
        if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
          $('input[type=submit]', context).mousedown();
          return false;
        } else {
          return true;
        }
      });



      var map = $('#map',context)[0];
      var openInfoWindow  =false;
      
      if (map){
        var map = new google.maps.Map(map, {
          zoom: 7,
          center:  new google.maps.LatLng(51.171935,4.681953),
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        map.markers = [];
        
               
        //var json = $('input[name="bpost[result][poisjson]"]', context).val();
        var json = $('input[name="poisjson"]', context).val();
      
        var pois = jQuery.parseJSON(json);
        
        if (pois){
    
          var latlngbounds = new google.maps.LatLngBounds();
      
          $.each(pois, function(index, poi) {     
            var latlng = new google.maps.LatLng(poi.Latitude, poi.Longitude)
            latlngbounds.extend(latlng);
            
            var marker = new google.maps.Marker({
              map: map,
              position: latlng ,
              title: poi.Name,
              icon: Drupal.settings.basePath + poi.Icon
            });
            map.markers.push(marker);
            
            var infoWindow = new google.maps.InfoWindow();
            infoWindow.setContent( $('#infowindow-' + poi.Id, context).html() );
        
            google.maps.event.addListener(infoWindow, 'domready', function () {
              openInfoWindow = infoWindow;
              $('#select-' + poi.Id).once('select-poi').click(function(){   
                var html = $('#html-' + poi.Id, context).html();
                var func = 'parent.' + settings.callback + '(poi, html)';
                eval (func);
                parent.jQuery.fancybox.close();
                return false;
              });
            });           
                   
            google.maps.event.addListener(marker, 'click', function() {
              if (openInfoWindow) openInfoWindow.close();
              infoWindow.open(map,marker);         
              $('#li-' + poi.Id).addClass('active');          
            });
        
            $('#li-' + poi.Id).click(function(){
              if (openInfoWindow) openInfoWindow.close();
              infoWindow.open(map,marker); 
              $(this).addClass('active');
            });
        
          });

          map.fitBounds(latlngbounds);        
          
        }
      }   
           
      $('#result .pois', context).slideDown('slow');
     
            
    }    
  }
})(jQuery);

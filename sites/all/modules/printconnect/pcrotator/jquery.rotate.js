(function ($) {
  $.fn.rotate = function(speed, title) {
    this.once().each(function(index, value){
      var elem = $(this);

      if ($('div.block',elem).length > 1) {
        var controller = $('<span class="controller"></span>', this);
        
        var elemIndex = index;
        elem.wrap('<div class="rotator-wrapper"/>');

        controller.append('<span class="title">' + title + '</span>');

        controls = $('<span class="controls"/>');

        controller.append(controls);

        $('div.block', elem).each(function (index, value){
          var checkbox =$('<input type="radio" name="controller' + elemIndex + '"></input>').click(function (){
            clearInterval(interval);
            $('.current', elem).hide().removeClass('current');
            $('div.block:nth-child(' + ($(this).index() + 1) +')', elem).addClass('current').show();
          });
          controls.append(checkbox);
        }).hide().css('position', 'absolute').first().show().addClass('current');

        
        $('input:first-child', controls).attr('checked', true);

        elem.before(controller);

        var interval = setInterval(function(){
          $('div.current', elem).each(function (){
            var current = $(this);
            var next = (current.next('div.block').length) ? current.next('div.block'): $('div.block:first',current.parent());
            current.fadeOut('slow').removeClass('current');
            next.addClass('current').fadeIn('slow');

            var index = next.index();
            index += 1;
            $('input:nth-child(' + index + ')', controls).attr('checked', true);
          });
        }, speed);
      }

    });
    return this;
  };
})(jQuery);
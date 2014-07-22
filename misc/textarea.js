(function ($) {
	
	Drupal.behaviors.textarea = {
  attach: function (context, settings) {
    $('.form-textarea-wrapper.resizable', context).once('textarea', function () {
      var staticOffset = null;
      var textarea = $(this).addClass('resizable-textarea').find('textarea');
      var grippie = $('<div class="grippie"></div>').mousedown(startDrag);

      grippie.insertAfter(textarea);

      function startDrag(e) {
        staticOffset = textarea.height() - e.pageY;
        textarea.css('opacity', 0.25);
        $(document).mousemove(performDrag).mouseup(endDrag);
        return false;
      }

      function performDrag(e) {
        var  before = textarea.height();
        textarea.height(Math.max(32, staticOffset + e.pageY) + 'px');
        var after = textarea.height();
        if (parent.jQuery('#fancybox-content').length > 0) {
            parent.jQuery('#fancybox-content').height(parent.jQuery('#fancybox-content').height() + (after - before));
        }
        
        return false;
      }

      function endDrag(e) {
        $(document).unbind('mousemove', performDrag).unbind('mouseup', endDrag);
        textarea.css('opacity', 1);
      }
    });
  }
};
	


})(jQuery);
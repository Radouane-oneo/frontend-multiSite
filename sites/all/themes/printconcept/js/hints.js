(function ($) {
  Drupal.behaviors.hints = {
    detach: function (context) {

    },
    attach: function (context, settings) {

      $('.canvas .form-item').has('.description').has('input:text,input:password').each(function (index, data){
        var inputHeight = $('input', this).outerHeight();
        var inputLeft = $('input', this).position().left;
        $(this).css('position', 'relative');

        $(this).find('input:text,input:password').attr('title', $(this).find('.description').text());

        $('.description', this).height(inputHeight).css({
            position: "absolute",
            top: 0,
            left: inputLeft,
            'line-height': inputHeight + 'px'
        })
        $('.description', this).click(function (){
          $(this).parent().find('input').focus();
        }).blur(function (){
          $(this).parent().find('input').blur();
        });

        if (!$(this).find('input:text,input:password').val()){
          $(this).addClass('hinted');
        }
        $(this).find('input:text,input:password').blur(function (){
          if (!$(this).val()){
            $(this).parent().addClass('hinted');
          }
        });
        $(this).find('input:text,input:password').focus(function (){
          if ($(this).parent().hasClass('hinted')){
            $(this).parent().removeClass('hinted');
          }
        });

      });
    }
  }
})(jQuery);
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
})(jQuery);;
(function ($) {
  Drupal.behaviors.pcrotator = {
    detach: function (context) {

    },
    attach: function (context, settings) {
      var region = $('.region-' + settings.pcrotator.region);
      var speed = settings.pcrotator.speed;
      
      var maxheight = 0;
      $('.rotating', region).each(function(){
        var height = $(this).height();
        
        if (height > maxheight){
          maxheight = height;
        }
      })
      
      $('.slides',region).height(maxheight);
      
      
      var interval = setInterval(function(){
        $('.rotating.current', region).each(function (){
          var current = $(this);
          var next = (current.next('div.block').length) ? current.next('.rotating'): $('.rotating:first',current.parent());
          current.fadeOut('slow').removeClass('current');
          next.addClass('current').fadeIn('slow');
          
          $('.controller a', region).removeClass('current');
          $('.controller a[href=#' + next.attr('id') + ']', region).addClass('current');
        });
      }, speed);
     
      $('.controller a', region).click(function(e){
        clearInterval(interval);
        var blockId = $(this).attr('href');
        $('.rotating', region).hide();
        $(blockId, region).show();
        $('.controller a', region).removeClass('current');
        $(this).addClass('current');
        return false;
      })
     
     
    }
  }
})(jQuery);;
/**
 * jQuery Masonry v2.1.08
 * A dynamic layout plugin for jQuery
 * The flip-side of CSS Floats
 * http://masonry.desandro.com
 *
 * Licensed under the MIT license.
 * Copyright 2012 David DeSandro
 */
(function(e,t,n){"use strict";var r=t.event,i;r.special.smartresize={setup:function(){t(this).bind("resize",r.special.smartresize.handler)},teardown:function(){t(this).unbind("resize",r.special.smartresize.handler)},handler:function(e,t){var n=this,s=arguments;e.type="smartresize",i&&clearTimeout(i),i=setTimeout(function(){r.dispatch.apply(n,s)},t==="execAsap"?0:100)}},t.fn.smartresize=function(e){return e?this.bind("smartresize",e):this.trigger("smartresize",["execAsap"])},t.Mason=function(e,n){this.element=t(n),this._create(e),this._init()},t.Mason.settings={isResizable:!0,isAnimated:!1,animationOptions:{queue:!1,duration:500},gutterWidth:0,isRTL:!1,isFitWidth:!1,containerStyle:{position:"relative"}},t.Mason.prototype={_filterFindBricks:function(e){var t=this.options.itemSelector;return t?e.filter(t).add(e.find(t)):e},_getBricks:function(e){var t=this._filterFindBricks(e).css({position:"absolute"}).addClass("masonry-brick");return t},_create:function(n){this.options=t.extend(!0,{},t.Mason.settings,n),this.styleQueue=[];var r=this.element[0].style;this.originalStyle={height:r.height||""};var i=this.options.containerStyle;for(var s in i)this.originalStyle[s]=r[s]||"";this.element.css(i),this.horizontalDirection=this.options.isRTL?"right":"left";var o=this.element.css("padding-"+this.horizontalDirection),u=this.element.css("padding-top");this.offset={x:o?parseInt(o,10):0,y:u?parseInt(u,10):0},this.isFluid=this.options.columnWidth&&typeof this.options.columnWidth=="function";var a=this;setTimeout(function(){a.element.addClass("masonry")},0),this.options.isResizable&&t(e).bind("smartresize.masonry",function(){a.resize()}),this.reloadItems()},_init:function(e){this._getColumns(),this._reLayout(e)},option:function(e,n){t.isPlainObject(e)&&(this.options=t.extend(!0,this.options,e))},layout:function(e,t){for(var n=0,r=e.length;n<r;n++)this._placeBrick(e[n]);var i={};i.height=Math.max.apply(Math,this.colYs);if(this.options.isFitWidth){var s=0;n=this.cols;while(--n){if(this.colYs[n]!==0)break;s++}i.width=(this.cols-s)*this.columnWidth-this.options.gutterWidth}this.styleQueue.push({$el:this.element,style:i});var o=this.isLaidOut?this.options.isAnimated?"animate":"css":"css",u=this.options.animationOptions,a;for(n=0,r=this.styleQueue.length;n<r;n++)a=this.styleQueue[n],a.$el[o](a.style,u);this.styleQueue=[],t&&t.call(e),this.isLaidOut=!0},_getColumns:function(){var e=this.options.isFitWidth?this.element.parent():this.element,t=e.width();this.columnWidth=this.isFluid?this.options.columnWidth(t):this.options.columnWidth||this.$bricks.outerWidth(!0)||t,this.columnWidth+=this.options.gutterWidth,this.cols=Math.floor((t+this.options.gutterWidth)/this.columnWidth),this.cols=Math.max(this.cols,1)},_placeBrick:function(e){var n=t(e),r,i,s,o,u;r=Math.ceil(n.outerWidth(!0)/this.columnWidth),r=Math.min(r,this.cols);if(r===1)s=this.colYs;else{i=this.cols+1-r,s=[];for(u=0;u<i;u++)o=this.colYs.slice(u,u+r),s[u]=Math.max.apply(Math,o)}var a=Math.min.apply(Math,s),f=0;for(var l=0,c=s.length;l<c;l++)if(s[l]===a){f=l;break}var h={top:a+this.offset.y};h[this.horizontalDirection]=this.columnWidth*f+this.offset.x,this.styleQueue.push({$el:n,style:h});var p=a+n.outerHeight(!0),d=this.cols+1-c;for(l=0;l<d;l++)this.colYs[f+l]=p},resize:function(){var e=this.cols;this._getColumns(),(this.isFluid||this.cols!==e)&&this._reLayout()},_reLayout:function(e){var t=this.cols;this.colYs=[];while(t--)this.colYs.push(0);this.layout(this.$bricks,e)},reloadItems:function(){this.$bricks=this._getBricks(this.element.children())},reload:function(e){this.reloadItems(),this._init(e)},appended:function(e,t,n){if(t){this._filterFindBricks(e).css({top:this.element.height()});var r=this;setTimeout(function(){r._appended(e,n)},1)}else this._appended(e,n)},_appended:function(e,t){var n=this._getBricks(e);this.$bricks=this.$bricks.add(n),this.layout(n,t)},remove:function(e){this.$bricks=this.$bricks.not(e),e.remove()},destroy:function(){this.$bricks.removeClass("masonry-brick").each(function(){this.style.position="",this.style.top="",this.style.left=""});var n=this.element[0].style;for(var r in this.originalStyle)n[r]=this.originalStyle[r];this.element.unbind(".masonry").removeClass("masonry").removeData("masonry"),t(e).unbind(".masonry")}},t.fn.imagesLoaded=function(e){function u(){e.call(n,r)}function a(e){var n=e.target;n.src!==s&&t.inArray(n,o)===-1&&(o.push(n),--i<=0&&(setTimeout(u),r.unbind(".imagesLoaded",a)))}var n=this,r=n.find("img").add(n.filter("img")),i=r.length,s="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",o=[];return i||u(),r.bind("load.imagesLoaded error.imagesLoaded",a).each(function(){var e=this.src;this.src=s,this.src=e}),n};var s=function(t){e.console&&e.console.error(t)};t.fn.masonry=function(e){if(typeof e=="string"){var n=Array.prototype.slice.call(arguments,1);this.each(function(){var r=t.data(this,"masonry");if(!r){s("cannot call methods on masonry prior to initialization; attempted to call method '"+e+"'");return}if(!t.isFunction(r[e])||e.charAt(0)==="_"){s("no such method '"+e+"' for masonry instance");return}r[e].apply(r,n)})}else this.each(function(){var n=t.data(this,"masonry");n?(n.option(e||{}),n._init()):t.data(this,"masonry",new t.Mason(e,this))});return this}})(window,jQuery);;
(function ($) {

/**
 * Handle the concept of a fixed number of slots.
 *
 * This behavior is dependent on the tableDrag behavior, since it uses the
 * objects initialized in that behavior to update the row.
 */
Drupal.behaviors.shortcutDrag = {
  attach: function (context, settings) {
    if (Drupal.tableDrag) {
      var table = $('table#shortcuts'),
        visibleLength = 0,
        slots = 0,
        tableDrag = Drupal.tableDrag.shortcuts;
      $('> tbody > tr, > tr', table)
        .filter(':visible')
          .filter(':odd').filter('.odd')
            .removeClass('odd').addClass('even')
          .end().end()
          .filter(':even').filter('.even')
            .removeClass('even').addClass('odd')
          .end().end()
        .end()
        .filter('.shortcut-slot-empty').each(function(index) {
          if ($(this).is(':visible')) {
            visibleLength++;
          }
          slots++;
        });

      // Add a handler for when a row is swapped.
      tableDrag.row.prototype.onSwap = function (swappedRow) {
        var disabledIndex = $(table).find('tr').index($(table).find('tr.shortcut-status-disabled')) - slots - 2,
          count = 0;
        $(table).find('tr.shortcut-status-enabled').nextAll(':not(.shortcut-slot-empty)').each(function(index) {
          if (index < disabledIndex) {
            count++;
          }
        });
        var total = slots - count;
        if (total == -1) {
          var disabled = $(table).find('tr.shortcut-status-disabled');
          // To maintain the shortcut links limit, we need to move the last
          // element from the enabled section to the disabled section.
          var changedRow = disabled.prevAll(':not(.shortcut-slot-empty)').not($(this.element)).get(0);
          disabled.after(changedRow);
          if ($(changedRow).hasClass('draggable')) {
            // The dropped element will automatically be marked as changed by
            // the tableDrag system. However, the row that swapped with it
            // has moved to the "disabled" section, so we need to force its
            // status to be disabled and mark it also as changed.
            var changedRowObject = new tableDrag.row(changedRow, 'mouse', false, 0, true);
            changedRowObject.markChanged();
            tableDrag.rowStatusChange(changedRowObject);
          }
        }
        else if (total != visibleLength) {
          if (total > visibleLength) {
            // Less slots on screen than needed.
            $('.shortcut-slot-empty:hidden:last').show();
            visibleLength++;
          }
          else {
            // More slots on screen than needed.
            $('.shortcut-slot-empty:visible:last').hide();
            visibleLength--;
          }
        }
      };

      // Add a handler so when a row is dropped, update fields dropped into new regions.
      tableDrag.onDrop = function () {
        tableDrag.rowStatusChange(this.rowObject);
        return true;
      };

      tableDrag.rowStatusChange = function (rowObject) {
        // Use "status-message" row instead of "status" row because
        // "status-{status_name}-message" is less prone to regexp match errors.
        var statusRow = $(rowObject.element).prevAll('tr.shortcut-status').get(0);
        var statusName = statusRow.className.replace(/([^ ]+[ ]+)*shortcut-status-([^ ]+)([ ]+[^ ]+)*/, '$2');
        var statusField = $('select.shortcut-status-select', rowObject.element);
        statusField.val(statusName);
      };

      tableDrag.restripeTable = function () {
        // :even and :odd are reversed because jQuery counts from 0 and
        // we count from 1, so we're out of sync.
        // Match immediate children of the parent element to allow nesting.
        $('> tbody > tr:visible, > tr:visible', this.table)
          .filter(':odd').filter('.odd')
            .removeClass('odd').addClass('even')
          .end().end()
          .filter(':even').filter('.even')
            .removeClass('even').addClass('odd');
      };
    }
  }
};

/**
 * Make it so when you enter text into the "New set" textfield, the
 * corresponding radio button gets selected.
 */
Drupal.behaviors.newSet = {
  attach: function (context, settings) {
    var selectDefault = function() {
      $(this).closest('form').find('.form-item-set .form-type-radio:last input').attr('checked', 'checked');
    };
    $('div.form-item-new input').focus(selectDefault).keyup(selectDefault);
  }
};

})(jQuery);
;
// $Id$

(function($) {
  Drupal.behaviors.BlockTab = {
    attach: function() {
      $('.block_tab-block').hide();
      $('.block_tab-block:first', '.block_tab-blocks').show();

      $('.block_tab-title').click(function() {
        var region = $(this).parent().attr('region');
        var id  = $(this).attr('id').replace(/block_tab-title-/, '', 'gi');

        $('[region="' + region + '"] .block_tab-block').hide();
        $('[region="' + region + '"] .block_tab-title').removeClass('active');

        $('[region="' + region + '"] #block_tab-block-' + id).fadeIn('fast');
        $(this).addClass('active');
      });
    }
  }
})(jQuery)
;
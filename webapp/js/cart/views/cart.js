define([
    'backbone',
    '../models/cart',
    'text!../templates/cart.html',
    'views/shipping',
    'views/jobView',
    'views/discountCode',
    'views/customerReference',
    'views/salesId',
    'views/priceBlock',
    'views/Error'
], function (Backbone, cartModel, cartTemplate, shippingView, jobView, discountView, customerReferenceView,salesIdView, priceBlockView, errorView) {

    return Backbone.View.extend({
        template: _.template(cartTemplate),
        events: {
            'click .close-tdc' : 'hideDetailTechnics'
        },
        initialize: function() {
            _this = this;
            this.config = require("config");
            this.model = new cartModel(this.config.cart);
            this.render();

            if(this.model.get("id") && this.model.get("orderItems").length > 0) {
                //error View
                this.errorView = new errorView(this.model);

                //job View
                this.jobView = new jobView(this.model);

                //shipping View
                this.shippingView = new shippingView(this.model);

                //discount View
                this.discountView = new discountView(this.model);

                //customerReference View
                this.customerReferenceView = new customerReferenceView(this.model);
                
                //salesId View
                this.salesIdView = new salesIdView(this.model);

                //priceBlock View
                this.priceBlockView = new priceBlockView(this.model);
                
            }
            clearInterval(timerSaveP);
            $("#save-progress-bar").find("div").stop(true).animate({width: 100 + '%'},1000, function(){
                $('#box-progress').hide();
                $('fieldset[data-orderitem="' + orderItemId + '"]').find(".designtoolmode a").click();
            });
            jQuery("#pccart-cart-form #jobBox  input[type='hidden']").each(function() {
                products.push({ identifier: jQuery(this).attr('productId'), amount: parseFloat(jQuery(this).val()), currency: 'EUR', quantity: jQuery(this).attr('quantity') });
            });
            basket['products'] = products;
             
            var s   = document.createElement('script');
            var x   = document.getElementsByTagName('script')[0];
            s.type  = 'text/javascript';
            s.async = true;
            s.src   = ('https:'==document.location.protocol?'https://':'http://')
                    + 'eu-sonar.sociomantic.com/js/2010-07-01/adpan/flyer-be';
            x.parentNode.insertBefore( s, x );
    
        },
        render : function(){
            this.setElement(this.template({
                "model" : this.model.toJSON(),
                "config" : this.config
            }));
            this.$('#WeAlsoMake').html($('.blocWeAlsoMake').parents('.block-block').html());
           // jQuery('#sidebar-second .blocWeAlsoMake').parents('.block-block').remove();
          
            $(this.config.containerId).html(this.$el);
        },
        changeShipping : function(orderItemShipping){
            this.model.set("orderItemShipping", orderItemShipping);
        },
        hideDetailTechnics : function(e){
            $('#technic-details').hide('fade',function(){
                $(this).html('<i class="close-tdc"></i>');
            })
        }
        
    });

});
define([
    'backbone',
    'text!../templates/shipping-edit.html',
    'text!../templates/shipping-edit-pickup.html',
    '../helpers/ajaxCaller'
], function (Backbone, shippingEditTemplate, shippingEditPickupTemplate, ajaxCaller) {

    return Backbone.View.extend({
        template: _.template(shippingEditTemplate),
        events: {
            "click #edit-shipping-detail-pickup-submit" : "saveShippingPickup"
        },
        initialize: function(model) {
            if (model.get("shippingAddresses").orderItemShipping && $.inArray(model.get("shippingAddresses").orderItemShipping['shippingTypeTag'], ["shippingTypeStoreInAntwerpen","shippingTypePrinter"]) != -1)
                return false;
            this.config = require("config");
            this.model = model;
            if (this.model.get("shippingAddresses").orderItemShipping && this.model.get("shippingAddresses").orderItemShipping['deliveryType'] != "deliveryTypeDeliver")
                this.template = _.template(shippingEditPickupTemplate);
            this.render();
            this.model.on("change",this.render,this);
        },
        render:function(){
            this.setElement(this.template({
                "model" : this.model.toJSON()
            }));

            $(this.config.editBox).find(".shippingBox").html(this.$el);
            this.initMap();
            this.initFancybox();
        },
        initMap: function(){
            var orderItemShipping = this.model.get("shippingAddresses").orderItemShipping;
            if(orderItemShipping && orderItemShipping.orderShippingAddress && orderItemShipping.orderShippingAddress.geographical) {
                var lat = orderItemShipping.orderShippingAddress.geographical['latitude'];
                var lng = orderItemShipping.orderShippingAddress.geographical['longitude'];
                var myLatlng = new google.maps.LatLng(lat, lng);
                var mapOptions = {
                    zoom: 16,
                    center: myLatlng
                }
                var map = new google.maps.Map(document.getElementById("Mapimg"), mapOptions);

                var marker = new google.maps.Marker({
                    position: myLatlng,
                    icon:"/sites/all/modules/printconnect/pcflyerstores/store.png"
                });

                marker.setMap(map);
            }
        },
        initFancybox: function(){
            $('.picker-link').fancybox({
                width: 993,
                height: '100%',
                padding: 0,
                margin: 0,
                scrolling: false,
                autoScale: false,
                hideOnOverlayClick: false,
                autoDimensions: false,
                helpers   : {
                    overlay : {closeClick: false} // prevents closing when clicking OUTSIDE fancybox
                }
            });
        },
        saveShippingPickup: function(){
            var me = this;

            var shippingError = this.errors();
            if(shippingError) {
                myCheckout.errorView.render(shippingError);
                $(window).scrollTop($(this.config.containerId).offset().top);
                return false;
            }

            ajaxCaller.call("saveShipping",{
                id : this.model.get("shippingAddresses").orderItemShipping.orderShippingAddress.id,
                name : this.$("input#edit-shipping-detail-contact").val(),
                type : this.model.get("shippingAddresses").orderItemShipping.deliveryType
            }).done(function(){
                    var shippingAddresses = $.extend(true, {}, me.model.get("shippingAddresses"));
                    shippingAddresses.orderItemShipping.orderShippingAddress.name = me.$("input#edit-shipping-detail-contact").val();
                    me.model.set("shippingAddresses", shippingAddresses);
            });
            return false;
        },
        errors : function(){
            console.log(this.model.get("shippingAddresses").orderItemShipping.shippingTypeTag);
            if(!this.model.get("shippingAddresses").orderItemShipping.orderShippingAddress || !this.model.get("shippingAddresses").orderItemShipping.orderShippingAddress.id)
                return this.config.labels[this.model.get("shippingAddresses").orderItemShipping.shippingTypeTag + "Error"];
            if(this.$("input#edit-shipping-detail-contact").val() == "")
                return this.config.labels["nameEmptyError"];
            return false;
        }

    });

});
define([
    'backbone',
    'text!../templates/shipping-edit.html',
    'text!../templates/shipping-edit-pickup.html',
    '../helpers/ajaxCaller'
], function (Backbone, shippingEditTemplate, shippingEditPickupTemplate, ajaxCaller) {

    return Backbone.View.extend({
        template: _.template(shippingEditTemplate),
        events: {
            "click #edit-shipping-detail-pickup-submit" : "saveShippingPickup",
            "click #edit-shipping-detail-current-actions-submit" : "saveShipping",
            "change #edit-shipping-detail-current-select" : "selectAddress",
            "blur #edit-shipping-detail-contact" : "changeName"
        },
        initialize: function(model) {
            this.config = require("config");
            this.model = model;
            if (model.get("shippingAddresses").orderItemShipping && $.inArray(model.get("shippingAddresses").orderItemShipping['shippingTypeTag'], ["shippingTypeStoreInAntwerpen","shippingTypePrinter"]) != -1)
                return false;
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

            this.$('select').select2();
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
            } else {
                this.$("#Mapimg").hide();
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
        selectAddress: function(e){
            var address = _.findWhere(this.model.get("shippingAddresses").addresses, {id: parseInt($(e.currentTarget).val())});
            if(!address) address = {};
            this.$("#edit-shipping-detail-current-name").val(address.name);
            this.$("#edit-shipping-detail-current-company").val(address.company);
            this.$("#edit-shipping-detail-current-street").val(address.street);
            this.$("#edit-shipping-detail-current-postalCode").val(address.postalCode);
            this.$("#edit-shipping-detail-current-city").val(address.city);
            this.$("#edit-shipping-detail-current-country").val(address.country);
            this.$("#edit-shipping-detail-current-phone").val(address.phone);
           // this.$("#edit-shipping-detail-current-email").val(address.email);
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
                deliverytype : this.model.get("shippingAddresses").orderItemShipping.deliveryType
            }).done(function(){
                    var shippingAddresses = $.extend(true, {}, me.model.get("shippingAddresses"));
                    shippingAddresses.orderItemShipping.orderShippingAddress.name = me.$("input#edit-shipping-detail-contact").val();
                    me.model.set("shippingAddresses", shippingAddresses);
            });
            return false;
        },
        saveShipping: function(){
            var me = this;

            var shippingError = this.errors();
            if(shippingError) {
                myCheckout.errorView.render(shippingError);
                $(window).scrollTop($(this.config.containerId).offset().top);
                return false;
            }

            var data = {
                "name" : this.$("#edit-shipping-detail-current-name").val(),
                "company" : this.$("#edit-shipping-detail-current-company").val(),
                "street" : this.$("#edit-shipping-detail-current-street").val(),
                "postalCode" : this.$("#edit-shipping-detail-current-postalCode").val(),
                "city" : this.$("#edit-shipping-detail-current-city").val(),
                "country" : this.$("#edit-shipping-detail-current-country").val(),
                "phone" : this.$("#edit-shipping-detail-current-phone").val(),
                //"email" : this.$("#edit-shipping-detail-current-email").val(),
                "deliverytype" : this.model.get("shippingAddresses").orderItemShipping.deliveryType
            };

            if(this.$("#edit-shipping-detail-current-select").val() != "0")
                data["id"] = this.$("#edit-shipping-detail-current-select").val();

            ajaxCaller.call("saveShipping",data).done(function(resultData){
                    if(resultData.code == "200") {
                        var shippingAddresses = $.extend(true, {}, me.model.get("shippingAddresses"));
                        shippingAddresses.orderItemShipping = resultData.data.orderItemShipping;
                        var index = _.findIndex(shippingAddresses.addresses, {id: resultData.data.customerAddress.id});
                        if(index != -1)
                            shippingAddresses.addresses[index] = resultData.data.customerAddress;
                        else
                            shippingAddresses.addresses.push(resultData.data.customerAddress);
                        me.model.set("shippingAddresses", shippingAddresses);
                    }
            });
            return false;
        },
        changeName: function(e){
            var shippingAddresses = $.extend(true, {}, this.model.get("shippingAddresses"));
            shippingAddresses.orderItemShipping.orderShippingAddress.name = $(e.currentTarget).val();
            this.model.set({"shippingAddresses": shippingAddresses},{silent: true});
        },
        errors : function(isPaymentButton){
            if(!isPaymentButton && this.model.get("shippingAddresses").orderItemShipping['deliveryType'] == "deliveryTypeDeliver")
                return this.checkFields();
            if(!this.model.get("shippingAddresses").orderItemShipping.orderShippingAddress || !this.model.get("shippingAddresses").orderItemShipping.orderShippingAddress.id)
                return this.config.labels[this.model.get("shippingAddresses").orderItemShipping.shippingTypeTag + "Error"];
            if(this.$("input#edit-shipping-detail-contact").length > 0) {
                this.$("input#edit-shipping-detail-contact").css("border-color","");
                if(this.$("input#edit-shipping-detail-contact").val() == "") {
                    this.$("input#edit-shipping-detail-contact").css("border-color","red");
                    return this.config.labels["nameEmptyError"];
                }
                if(this.$("input#edit-shipping-detail-contact").val().length < 3) {
                    this.$("input#edit-shipping-detail-contact").css("border-color","red");
                    return this.config.labels["invalidCharactersLength"];
                }
            }
            return false;
        },
        checkFields: function(){
            var pattern = /^[\w-\.]+@[a-zA-Z_-]+?\.[a-zA-Z]{2,3}$/;
            var name = this.$("#edit-shipping-detail-current-name").val(),
                street = this.$("#edit-shipping-detail-current-street").val(),
                postalCode = this.$("#edit-shipping-detail-current-postalCode").val(),
                city = this.$("#edit-shipping-detail-current-city").val(),
                country = this.$("#edit-shipping-detail-current-country").val(),
                phone = this.$("#edit-shipping-detail-current-phone").val();
                //email = this.$("#edit-shipping-detail-current-email").val();
            this.$('input:text').css("border-color", "");
            if(name == "" || street == "" || postalCode == "" || city == "" || country == "" || phone == "" /*|| email == ""*/) {
                this.$('input:text:not(#edit-shipping-detail-current-company)').filter(function() { return $(this).val() == ""; }).css("border-color", "red");
                return this.config.labels["requiredFieldsError"];
            }
            if(name.length < 3 || street.length < 3 || postalCode.length < 3 || city.length < 3 || phone.length < 3) {
                this.$('input:text:not(#edit-shipping-detail-current-company)').filter(function() { return $(this).val().length < 3; }).css("border-color", "red");
                return this.config.labels["invalidCharactersLength"];
            }

            /*if(!pattern.test(email)) {
                this.$("#edit-shipping-detail-current-email").css("border-color", "red");
                return this.config.labels["emailError"];
            }*/

            return false;
        }

    });

});
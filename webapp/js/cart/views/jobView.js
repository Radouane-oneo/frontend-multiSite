define([
	'backbone',
    'text!../templates/jobFull.html',
    'text!../templates/jobEmpty.html',
    'text!../templates/price.html',
    'text!../templates/jobTemplate.html',
    '../helpers/ajaxCaller'
], function (Backbone, jobFull, jobEmpty, priceTemplate, detailtsTechnic, ajaxCaller){

	return Backbone.View.extend({
		events: {
			'change .checkbox-event input[type="checkbox"]' : 'swithcJobEmpty',
			'click .removecart' : 'deleteOrder',
			'click .deletedesign' : 'deleteOrderDesign',
			'click .removecontrol' : 'deleteControlePro',
			'blur .refjobTxt' : 'changeRefJob',
			'blur .inputdesigneremail' : 'designerEmail',
			'click .technic-details' : 'showDetailTechnics'
		},
		initialize: function(model) {
			this.filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			this.config = require("config");
            this.model = model;
	        this.config.dummyUpload = this.model.get('dummyUpload');
	        this.render();
	        this.model.on("change",this.render,this);
	    },

	    render: function() {
	    	var _this = this;
            var content = "";
            _.each(this.model.toJSON().orderItems, function(item, i){
                orderItems = _this.model.toJSON();
                orderItem = orderItems.orderItems[i];

                //checke wich template should load
                if (item.files.length> 0) {
	    			template = _.template(jobFull);
	    		}else{template = _.template(jobEmpty)};

                content = template({
                	"model" : orderItem,
                	"config" : _this.config,
                	"priceTpl" : _.template(priceTemplate)
            	}) + content;
            });

            this.setElement(content);

            $(this.config.jobBox).html(this.$el);

            //set fancybox event
            this.showFancybox();

            this.setJobHeight();

	    },

	    swithcJobEmpty : function(e){
	    	var _this = this;
	    	jobItemEvent = $(e.currentTarget).parents('.job-item-event');
	    	if (e.currentTarget.checked) {
	    		jobItemEvent.find('.prodactTemplates').hide();
	    		jobItemEvent.find('.inputdesigner').show();
	    		jobItemEvent.find('.refJob-code').show();
	    		jobItemEvent.find('.preview2 > .description').addClass("jobDesigner");
	    	}else{

	    		jobItemEvent.find('.prodactTemplates').show();
	    		jobItemEvent.find('.inputdesigner').hide();
	    		jobItemEvent.find('.refJob-code').hide();
	    		jobItemEvent.find('.preview2 > .description').removeClass("jobDesigner");

	    		//set email designer to empty
	    		orderitem = jobItemEvent.parents('.orderBox').data('orderitem');
	    		ajaxCaller.call("setMailDeisigner",{
	    			'id':orderitem,
	    			'email': null
	    		},'POST').done(function(result){
	                if (result.code == '200') {
	                	_this.setDesignerEmailToModel(orderitem, null);
	                };
	            });
	    	}
	    },
	    deleteOrder : function(e){
	    	var _this = this;
	    	elmTarget = $(e.currentTarget);
	    	orderitem = elmTarget.data('orderitem');

	    	// remove job
            ajaxCaller.call("deleteJob",{}, 'GET', orderitem).done(function(result){
                if (result.code == '200') {
                	_this.deleteOrderFromMdel(orderitem, result);
                	var cartItems = $('#block-pccart-indicator a span').text();
                	var newCartItems = cartItems.replace( /\d+/g, _this.model.attributes.orderItems.length);
                	$('#block-pccart-indicator a span').text(newCartItems);
                };
            });

            elmTarget.parents('.orderBox').slideUp('fast', function(){
            	$(this).remove();
            });

	    },
	    deleteOrderFromMdel : function(jobID, data){
	    	var myModel = jQuery.extend(true, [], this.model);
	    	orderItems = myModel.attributes.orderItems;
	    	for (var i = 0; i< orderItems.length; i++) {
	    		if ( orderItems[i].id== jobID) {
	    			orderItems.splice(i, 1);
	    			myModel.attributes.discountItems = data.data.discountItems;
	    		};
	    	};
	    	this.model.set({"orderItems": orderItems,"discountItems":  myModel.attributes.discountItems});
	    	if(this.model.attributes.orderItems.length == 0)
	    		myCart.render();
	    },
	    deleteOrderDesign : function(e){
	    	var _this = this;
	    	elmTarget = $(e.currentTarget);
	    	orderitem = elmTarget.data('orderitem');
	    	// remove job
            ajaxCaller.call("deleteJobDesign",{}, 'GET', orderitem).done(function(result){
                if (result.code == '200') {
                	_this.deleteFileFromData(orderitem, result);
                };
            });
	    },
	    deleteFileFromData : function(jobID, data){
	    	var myModel = jQuery.extend(true, [], this.model);
	    	orderItems = myModel.attributes.orderItems;
	    	for (var i = 0; i< orderItems.length; i++) {
	    		if (orderItems[i].id== jobID) {
	    			orderItems[i].files = [];
	    			orderItems[i].fotoliaItems = [];
	    			orderItems[i].fileCheck = {};
	    			myModel.attributes.discountItems = data.data.discountItems;
	    		};
	    	};
	    	this.model.set({"orderItems": orderItems,"discountItems":  myModel.attributes.discountItems});
	    },
	    deleteControlePro : function(e){
	    	var _this = this;
	    	elmTarget = $(e.currentTarget);
	    	orderitem = elmTarget.data('orderitem');
	    	// remove job
            ajaxCaller.call("deleteFileCheck",{}, 'GET', orderitem).done(function(result){
                if (result.code == '200') {
                	_this.deleteFileCheckFromData(orderitem, result);
                };
            });

             elmTarget.parents('.control-block').fadeIn('fast', function(){
            	$(this).remove();
            });
	    },
	    deleteFileCheckFromData : function(jobID, data){
	    	var myModel = jQuery.extend(true, [], this.model);
	    	orderItems = myModel.attributes.orderItems;
	    	for (var i = 0; i< orderItems.length; i++) {
	    		if ( orderItems[i].id== jobID) {
	    			orderItems[i].fileCheck = {};
	    			myModel.attributes.discountItems = data.data.discountItems;
	    		};
	    	};
	    	this.model.set({"orderItems": orderItems,"discountItems":  myModel.attributes.discountItems});
	    },
	    changeRefJob : function(e){
	    	var value = $(e.currentTarget).val();
	    	if (value !='') {
	    		var _this = this;
	    		elmTarget = $(e.currentTarget);
	    		orderitem = elmTarget.parents('.orderBox').data('orderitem');

	    		ajaxCaller.call("setRefJob",{
	    			'id':orderitem,
	    			'refJob': value
	    		},'POST').done(function(result){
	                if (result.code == '200') {
	                	_this.setRefJobToModel(orderitem, value);
	                };
	            });	
	    	};
	    },
	    setRefJobToModel : function(jobID, refjobValue){
	    	var orderItems = jQuery.extend(true, [], this.model.attributes.orderItems);
	    	for (var i = 0; i< orderItems.length; i++) {
	    		if ( orderItems[i].id== jobID) {
	    			orderItems[i].refJob = refjobValue;
	    		};
	    	};

	    	this.model.set({"orderItems" : orderItems}, {"silent" : true});
	    },
	    designerEmail : function(e){
	    	var value = $(e.currentTarget).val();
	    	if (value !='' && this.filter.test(value)) {
	    		var _this = this;
	    		elmTarget = $(e.currentTarget);
	    		orderitem = elmTarget.parents('.orderBox').data('orderitem');
	    		ajaxCaller.call("setMailDeisigner",{
	    			'id':orderitem,
	    			'email': value
	    		},'POST').done(function(result){
	                if (result.code == '200') {
	                	_this.setDesignerEmailToModel(orderitem, value);
	                };
	            });	
	    	};
	    },
	    setDesignerEmailToModel : function(jobID, email){
	    	var orderItems = jQuery.extend(true, [], this.model.attributes.orderItems);
	    	for (var i = 0; i< orderItems.length; i++) {
	    		if ( orderItems[i].id== jobID) {
	    			orderItems[i].emailDesigner = email;
	    		};
	    	};

	    	this.model.set("orderItems", orderItems);
	    },
	    showFancybox : function(){
	    	$('.orderBox .designtool').fancybox({
                width: 1024,
                height: '100%',
                padding: 5,
                margin: 0,
                scrolling: false,
                autoScale: false,
                hideOnOverlayClick: false,
                autoDimensions: false,
                modal: false,
		       	helpers   : { 
		          	overlay : {closeClick: false} // prevents closing when clicking OUTSIDE fancybox 
		       	},
	                afterLoad: function() { 
                 		$(".fancybox-skin").addClass("designtool"); 
		            }  
		    });
	    },
	    showDetailTechnics : function(e){
	    	var template = _.template(detailtsTechnic);
	    	orderId = $(e.currentTarget).data('orderitem');
	    	orderItems = this.model.attributes.orderItems;
	    	for (var i = 0; i< orderItems.length; i++) {
	    		if ( orderItems[i].id== orderId) {
	    			orderItem = orderItems[i];
	    		};
	    	};

	    	tpl = template({
                "model" : orderItem,
                "config" : this.config
            });

            $(this.config.detailTechnic).html(tpl);
            $('#technic-details').show();
	    	e.preventDefault();
	    },
	    setJobHeight : function () {
	    	$("#pccart-cart-form .jobfull").each(function(i, elem) {
	    		$(elem).find(".image img").load(function(){
			  		var maxHeight = $(elem).find(".image").height();
			  		var previewHeight = $(elem).find(".preview1").height();

			  		if ( maxHeight > previewHeight ) {
			  			$(elem).find(".preview1").css("height" , maxHeight+"px"); 
			  		} else {
			  			previewHeight += 40;
			  			$(elem).find(".preview1").css("height" , previewHeight+"px"); 
			  		}	
				});     		
    		});   	   	
	    }, 
        errors : function(){
        	var orderItems = this.model.get('orderItems');
        	for (var i = 0; i< orderItems.length; i++) {
        		var checkBox = $(this.config.jobBox).find('.orderBox[data-orderitem="'+orderItems[i].id+'"]').find('.checkbox-event input[type="checkbox"]');
        		var inputBox = $(this.config.jobBox).find('.orderBox[data-orderitem="'+orderItems[i].id+'"]').find('.inputdesigneremail');
	    		if (checkBox.is(':checked')) {
	    			if (inputBox.val() == "" || inputBox.val() ==null) {
	    				return this.config.labels['jobNotNullErrorMail'];
	    			}

	    			if (!this.filter.test(inputBox.val())) {
	    				return this.config.labels['jobNotNullErrorMailNotValid'];
	    			}

				}else if(orderItems[i].files.length<= 0){
					return this.config.labels['jobNotNullError'];
				}
	    	};
	    	return false;
        }
	});

});

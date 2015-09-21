define([
	'backbone',
    'text!../templates/jobFull.html',
    'text!../templates/jobEmpty.html',
    'text!../templates/price.html',
    '../helpers/ajaxCaller'
], function (Backbone, jobFull, jobEmpty, priceTemplate, ajaxCaller){

	return Backbone.View.extend({
		events: {
			'change .checkbox-event input[type="checkbox"]' : 'swithcJobEmpty',
			'click .removecart' : 'deleteOrder',
			'click .deletedesign' : 'deleteOrderDesign',
			'click .removecontrol' : 'deleteControlePro',
			'blur .refjobTxt' : 'changeRefJob',
			'blur .inputdesigneremail' : 'designerEmail'
		},
		initialize: function(model) {
			this.config = require("config");
            this.model = model;
	        this.render();
	        this.model.on("change",this.render,this);
	    },

	    render: function() {
	    	console.log('render');
	    	var _this = this;
            var content = "";
            _.each(this.model.toJSON().orderItems, function(item, i){
                orderItems = _this.model.toJSON();
                orderItem = orderItems.orderItems[i];

                //checke wich template should load
                if (item.files.length> 0) {
	    			template = _.template(jobFull);
	    		}else{template = _.template(jobEmpty)};

                content += template({
                	"model" : orderItem,
                	"config" : _this.config,
                	"priceTpl" : _.template(priceTemplate)
            	});
            });

            this.setElement(content);

            $(this.config.jobBox).html(this.$el);

            //set fancybox event
            this.showFancybox();

	    },

	    swithcJobEmpty : function(e){
	    	jobItemEvent = $(e.currentTarget).parents('.job-item-event');
	    	if (e.currentTarget.checked) {
	    		jobItemEvent.find('.prodactTemplates').hide();
	    		jobItemEvent.find('.inputdesigner').show();
	    	}else{

	    		jobItemEvent.find('.prodactTemplates').show();
	    		jobItemEvent.find('.inputdesigner').hide();

	    		//set email designer to empty
	    		/*orderitem = jobItemEvent.parents('.orderBox').data('orderitem');
	    		this.setDesignerEmailToModel(orderitem, '');*/
	    	}
	    },
	    deleteOrder : function(e){
	    	var _this = this;
	    	elmTarget = $(e.currentTarget);
	    	orderitem = elmTarget.data('orderitem');

	    	// remove job
            ajaxCaller.call("deleteJob",{}, 'GET', orderitem).done(function(result){
                if (result.code == '200') {
                	_this.deleteOrderFromMdel(orderitem);
                };
            });

            elmTarget.parents('.orderBox').slideUp('fast', function(){
            	$(this).remove();
            });

	    },
	    deleteOrderFromMdel : function(jobID){
	    	var orderItems = jQuery.extend(true, [], this.model.attributes.orderItems);
	    	for (var i = 0; i< orderItems.length; i++) {
	    		if ( orderItems[i].id== jobID) {
	    			orderItems.splice(i, 1);
	    		};
	    	};
	    	this.model.set("orderItems", orderItems);
	    },
	    deleteOrderDesign : function(e){
	    	var _this = this;
	    	elmTarget = $(e.currentTarget);
	    	orderitem = elmTarget.data('orderitem');
	    	// remove job
            ajaxCaller.call("deleteJobDesign",{}, 'GET', orderitem).done(function(result){
                if (result.code == '200') {
                	_this.deleteFileFromData(orderitem);
                };
            });
	    },
	    deleteFileFromData : function(jobID){
	    	var orderItems = jQuery.extend(true, [], this.model.attributes.orderItems);
	    	for (var i = 0; i< orderItems.length; i++) {
	    		if (orderItems[i].id== jobID) {
	    			orderItems[i].files = [];
	    			orderItems[i].fotoliaItems = [];
	    			orderItems[i].fileCheck = {};
	    		};
	    	};
	    	this.model.set("orderItems", orderItems);
	    },
	    deleteControlePro : function(e){
	    	var _this = this;
	    	elmTarget = $(e.currentTarget);
	    	orderitem = elmTarget.data('orderitem');
	    	// remove job
            ajaxCaller.call("deleteFileCheck",{}, 'GET', orderitem).done(function(result){
                if (result.code == '200') {
                	_this.deleteFileCheckFromData(orderitem);
                };
            });

             elmTarget.parents('.control-block').fadeIn('fast', function(){
            	$(this).remove();
            });
	    },
	    deleteFileCheckFromData : function(jobID){
	    	var orderItems = jQuery.extend(true, [], this.model.attributes.orderItems);
	    	for (var i = 0; i< orderItems.length; i++) {
	    		if ( orderItems[i].id== jobID) {
	    			orderItems[i].fileCheck = {};
	    		};
	    	};
	    	this.model.set("orderItems", orderItems);
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

	    	this.model.set("orderItems", orderItems);
	    },
	    designerEmail : function(e){
	    	var value = $(e.currentTarget).val();
	    	filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	    	if (value !='' && filter.test(value)) {
	    		console.log('mail valid');
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
                modal: false
            });
	    },
        errors : function(){
            return this.config.labels['jobNotNullError'];
        }
	});

});

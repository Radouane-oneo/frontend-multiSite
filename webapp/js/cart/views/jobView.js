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
			'click .removecart' : 'deleteOrder'
		},
		initialize: function(model) {
			this.config = require("config");
            this.model = model;
	        this.render();
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

                content += template({
                	"model" : orderItem,
                	"config" : _this.config,
                	"priceTpl" : _.template(priceTemplate)
            	});

            });


            this.setElement(content);

            $(this.config.jobBox).append(this.$el);

	    },

	    swithcJobEmpty : function(e){
	    	jobItemEvent = $(e.currentTarget).parents('.job-item-event');
	    	if (e.currentTarget.checked) {
	    		jobItemEvent.find('.prodactTemplates').slideUp('fast');
	    		jobItemEvent.find('.inputdesigner').slideDown();
	    	}else{

	    		jobItemEvent.find('.prodactTemplates').slideDown();
	    		jobItemEvent.find('.inputdesigner').slideUp('fast');
	    	}
	    },
	    deleteOrder : function(e){
	    	var _this = this;
	    	elmTarget = $(e.currentTarget);
	    	orderitem = elmTarget.data('orderitem');

	    	// remove job
            ajaxCaller.call("deleteJob",{
                orderId : orderitem
            }).done(function(job){
                job.jobID = orderitem;
                if (job.jobDeleted) {
                	_this.deleteOrderFromMdel(orderitem);
                };
            });

            elmTarget.parents('.orderBox').slideUp('fast', function(){
            	$(this).remove();
            });

	    },
	    deleteOrderFromMdel : function(jobID){
	    	console.log(this.model)
	    }
	});

});

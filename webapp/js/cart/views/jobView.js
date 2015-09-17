define([
	'backbone',
    'text!../templates/jobFull.html',
    'text!../templates/jobEmpty.html'
], function (Backbone, jobFull, jobEmpty){

	return Backbone.View.extend({
		events: {
			'change .checkbox-event input[type="checkbox"]' : 'swithcJobEmpty'
		},
		initialize: function(model, templatetoLoad) {
			this.config = require("config");
            this.model = model;
	        this.render(templatetoLoad);
	    },

	    render: function(templatetoLoad) {
	    	//if order has created
	    	if (templatetoLoad == true) {
	    		template = _.template(jobFull);

	    	}else{template = _.template(jobEmpty)};

	        this.setElement(template({
                "model" : this.model,
                "config" : this.config
            }));

            $(this.config.jobBox).append(this.$el);

	    },

	    swithcJobEmpty : function(e){

	    	jobItemEvent = $(e.currentTarget).parents('.job-item-event');
	    	if (e.currentTarget.checked) {
	    		jobItemEvent.find('.prodactTemplates').hide();
	    		jobItemEvent.find('.inputdesigner').show();
	    	}else{

	    		jobItemEvent.find('.prodactTemplates').show();
	    		jobItemEvent.find('.inputdesigner').hide();
	    	}
	    }
	});

});

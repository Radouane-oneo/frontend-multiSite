define([
	'backbone',
    'text!../templates/jobFull.html',
    'text!../templates/jobEmpty.html'
], function (Backbone, jobFull, jobEmpty){

	return Backbone.View.extend({
		initialize: function(model) {
			this.config = require("config");
            this.model = model;
	        this.render();
	    },

	    render: function() {
	    	this.template = _.template(jobEmpty);

	        this.setElement(this.template({
                "model" : this.model.toJSON(),
                "config" : this.config
            }));

            $(this.config.jobBox).html(this.$el);
	    }
	});

});

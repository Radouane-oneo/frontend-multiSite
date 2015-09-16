var jobempty = Backbone.View.extend({
    initialize: function() {
        this.render();
    },

    render: function() {
    	this.template = _.template($('#templateJobEmpty').html());
        this.$el.html( template );
    }
});


var jobFull = Backbone.View.extend({
    initialize: function() {
        this.render();
    },

    render: function() {
    	this.template = _.template($('#templateJobFull').html());
        this.$el.html( template );
    }
});
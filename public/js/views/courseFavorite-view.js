var app = app || {};


var app = app || {};
(function() {
    'use strict';

    var favView = Backbone.View.extend({
        el:"#courses",
        collection: null,

        initialize: function(options) {
            this.collection = options.collecti;
            var handler = _.bind(this.render(),this);
            this.model.bind('change', handler);
            this.model.bind('add', handler);
            this.model.bind('remove', handler);


        },

        render: function() {
            var favorites_list = $("#courses");
            console.log(this.collection);
            var that = this;
            this.collection.forEach(function(favorite, index){
                var favorite1  = new app.singleFavView({
                   model:favorite
                });
                that.$el.append(favorite1.render().el);
            });


           return this;
        },
    });

    return app.CourseFavoriteView = favView;
})();
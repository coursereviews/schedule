var app = app || {};


var app = app || {};
//var $ = require('jquery');
//var _ = require('underscore');
//var Backbone = require('backbone');

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
            //TODO: the data is in apps.favorite collection...?
            //TODO: I am assuming courses is where favorites are placed
            var favorites_list = $("#courses");
            console.log(this.collection);
            var that = this;
            this.collection.forEach(function(favorite, index){
                var favorite1  = new app.singleFavView({
                   model:favorite
                });
                that.$el.append(favorite1.render().el);

                //favorites_list.appendChild(template(
                //    //TODO:takes some object so maybe we could get
                //    //TODO:{course_title: favorite.SOMETHING}
                //    favorite
                //));
            });


           return this;
        },
    });

    return app.FavoriteView = favView;
})();
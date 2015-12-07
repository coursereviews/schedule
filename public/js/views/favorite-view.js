var app = app || {};
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

(function() {
    'use strict';

    var FavoriteView = Backbone.View.extend({

        initialize: function() {
            var handler = _.bind(this.render(),this);
            this.model.bind('change', handler);
            this.model.bind('add', handler);
            this.model.bind('remove', handler);
        },

        render: function() {
            //TODO: the data is in apps.favorite collection...?
            //TODO: I am assuming courses is where favorites are placed
            var favorites_list = $("courses");
            app.favoritesCollection.each(function(favorite, index){
                var template = _.template($("#favorite-template").html());
                favorites_list.appendChild(template(
                    //TODO:takes some object so maybe we could get
                    //TODO:{course_title: favorite.SOMETHING}
                    favorite
                ));
            });
            this.$el.html(favorites_list.html());
            return this;
        },
    });

    return app.FavoriteView = FavoriteView;
})();
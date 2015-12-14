/**
 * Created by KHC on 12/6/2015.
 */

var app = app || {};



(function() {
    'use strict';

    var favorites = Backbone.Collection.extend({
        model: app.CourseFavoriteModel,
        url: '/api/favorite/'

    });


    app.CourseFavoritesCollection = new favorites();

})();
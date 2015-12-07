/**
 * Created by KHC on 12/6/2015.
 */

var app = app || {};

(function() {
    'use strict';

    var favorites = Backbone.Collection.extend({
        initialize: function(){},
        model: app.FavoriteModel,
        url: '/api/favorite'
    });

    app.favoritesCollection = new favorites();
})();
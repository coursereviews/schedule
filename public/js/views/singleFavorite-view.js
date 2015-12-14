/**
 * Created by KHC on 12/13/2015.
 */

var app = app || {};

(function() {
    'use strict';

    app.singleFavView = Backbone.View.extend({

        initialize: function() {
            this.render();
        },

        render: function() {
            var template = _.template($("#favorite-template").html());
            this.$el.html(template(this.model.toJSON()));
            return this;
        },
    });
})();


/**
 * Created by KHC on 12/6/2015.
 */

var app = app || {};

(function() {
    'use strict';

    var favorite = Backbone.Model.extend({
        //todo: consider id as well
        //todo: incorrect key for the values. Don't think the data have something like course_title
        initialize: function() {},
        defaults: {
            code: '',
            department_id: '',
            type: ''
        }
    });

    app.FavoriteModel = favorite;
})();
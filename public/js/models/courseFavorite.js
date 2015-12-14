/**
 * Created by KHC on 12/6/2015.
 */

var app = app || {};

(function() {
    'use strict';

    var favorite = Backbone.Model.extend({
        initialize: function() {},
        urlRoot:"/api/favorite",

        sync: function(method, model,options){
            switch (method.toLowerCase()){
                case 'create':
                    options.url = "/api/favorite/"+ model.get('courseId');
                    break;
            }
            return Backbone.sync(method,model,options);
        }

    });

    app.CourseFavoriteModel = favorite;
})();
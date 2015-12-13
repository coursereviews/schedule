var app = app || {};

(function() {
  'use strict';

  app.ScheduleModel = Backbone.Model.extend({
    url: function() {
      return '/api/schedule/' + this.get('id');
    },

    parse: function(response, options) {
      app.extracurriculars.set(response.extraCurriculars);
      response.extraCurriculars = app.extracurriculars;

      app.courseOfferings.set(response.courseOfferings);
      response.courseOfferings = app.courseOfferings;

      return response;
    },

    toJSON: function() {
      var json = Backbone.Model.prototype.toJSON.call(this);
      var self = this;

      ['extraCurriculars', 'courseOfferings'].forEach(function(collection) {
        json[collection] = self.get(collection).map(function(model) {
          return model.get('id');
        });
      });

      return json;
    }
  });

})();

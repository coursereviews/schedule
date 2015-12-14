var app = app || {};

(function() {
  'use strict';

  var ScheduleModel = Backbone.Model.extend({
    url: function() {
      return '/api/schedule/' + (this.get('id') || '');
    },

    initialize: function() {
      this.set('extraCurriculars', app.extracurriculars);
      this.set('courseOfferings', app.courseOfferings);
    },

    parse: function(response, options) {
      app.extracurriculars.reset(response.extraCurriculars);
      response.extraCurriculars = app.extracurriculars;

      app.courseOfferings.reset(response.courseOfferings);
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

  app.ScheduleModel = ScheduleModel;

})();



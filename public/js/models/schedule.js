var app = app || {};

(function() {
  'use strict';

  var ScheduleModel = Backbone.Model.extend({
    url: function() {
      return '/api/schedule/' + (this.get('id') || '');
    },

    sync: function(method, model, options) {
      if (method === 'update') {
        method = 'patch';
      }

      return Backbone.sync.apply(this, [method, model, options]);
    },

    initialize: function() {
      this.set('extraCurriculars', app.extracurriculars);
      this.set('courseOfferings', app.courseOfferings);
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

      return _.omit(json, 'user');
    }
  });

  app.ScheduleModel = ScheduleModel;

})();



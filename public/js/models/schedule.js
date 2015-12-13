var app = app || {};

(function() {
  'use strict';

  app.ScheduleModel = Backbone.Model.extend({
    url: function() {
      return '/api/schedule/' + (this.get('id') || '');
    },

    initialize: function() {
      this.assignCollections();
    },

    parse: function(response, options) {
      this.assignCollections();

      this.get('extraCurriculars').set(response.extraCurriculars);
      this.get('courseOfferings').set(response.courseOfferings);

      return response;
    },

    assignCollections: function() {
      this.set('extraCurriculars', app.extracurriculars);
      this.set('courseOfferings', app.courseOfferings);
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

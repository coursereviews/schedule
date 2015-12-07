var app = app || {};

(function() {
  'use strict';

  app.ExtraCurricular = Backbone.Model.extend({
    defaults: {
      start_time: '',
      end_time: '',
      start_date: '',
      end_date: '',
      days: []
    },

    toJSON: function() {
      var json = Backbone.Model.prototype.toJSON.call(this);

      json.days = this.get('days').split(',').reduce(toSentence);

      return json;
    }
  });

  function toSentence(a, b, i, array) {
    return a + (i + 1 == array.length
      ? (array.length == 2 ? '' : ',') + ' and '
      : ', ') + b;
  }

})();

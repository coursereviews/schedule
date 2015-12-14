var app = app || {};

(function() {
  'use strict';

  var TermModel = Backbone.Model.extend({
    parse: function(response, options) {
      var seasons = {
        '10': 'Winter',
        '20': 'Spring',
        '65': 'Summer',
        '90': 'Fall'
      };

      response.season = seasons[response.code.slice(4)];
      response.year = response.code.slice(0, 4);
      
      return response;
    }
  });

  app.TermModel = TermModel;
})();

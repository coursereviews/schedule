var app = app || {};

(function() {
  'use strict';

  var CourseView = Backbone.View.extend({
    tagName: 'div',

    className: 'col-md-12',

    attributes: {
      'style': 'padding-top: .35cm'
    },

    template: _.template($('#course-item-template').html()),

    events: {
      'click .course-panel-heading': 'showDetailView',
      'click #favstar': 'favorite'
    },

    initialize: function() {
      this.listenTo(this.model, 'destroy', this.remove);
      this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

    favorite: function(e) {
      var star = $(e.currentTarget);
      if (star.attr('class') === 'glyphicon glyphicon-star-empty fav-star') {
        star.attr('class', 'glyphicon glyphicon-star fav-star');
      } else {
        star.attr('class', 'glyphicon glyphicon-star-empty fav-star');
      }
      star.closest('div').trigger('click');

      // CODE FOR POST NEW FAVORITE ----->
    },

    showDetailView: function(e) {
      var hiddenDetails = $(e.currentTarget).parent().children('.course-panel-body.hidden');
      var shownDetails = $(e.currentTarget).parent().children('.course-panel-body');
      if (hiddenDetails.length !== 0) {
        hiddenDetails.removeClass('hidden');
        hiddenDetails.show();
      } else {
        shownDetails.addClass('hidden');
        shownDetails.hide();
      }
    }
  });

  app.CourseView = CourseView;

})();

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
      if(this.model.get('favorite')===true){
        this.model.set({starClass:'glyphicon glyphicon-star fav-star'});
      }else{
        this.model.set({starClass:'glyphicon glyphicon-star-empty fav-star'});
      }
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

    favorite: function(e) {
      var star = $(e.currentTarget);
      if (star.attr('class') === 'glyphicon glyphicon-star-empty fav-star') {
        star.attr('class', 'glyphicon glyphicon-star fav-star');

        var fav = new app.CourseFavoriteModel({courseId:this.model.get('id')});
        fav.save();

      } else {
        star.attr('class', 'glyphicon glyphicon-star-empty fav-star');

        var fav = new app.CourseFavoriteModel({id:this.model.get('id')});
        fav.destroy();

      } star.closest('div').trigger("click");
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

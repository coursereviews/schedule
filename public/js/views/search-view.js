var app = app || {};

(function() {
  'use strict';

  app.SearchView = Backbone.View.extend({

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html($("#search-template").html());
      return this;
    },

    events: {
      "click .list-group-item": "doSearch"
    },

    doSearch: function(e) {
      var querystring = 'query?' +$(e.currentTarget).attr('id');
      var courses;
      $.ajax({
        method: 'GET',
        url: '/api/catalog/'+querystring,
        dataType: 'json',
        context: this,
        success: function(r){this.newCourseList(r);}
      });
    },

    newCourseList: function(list){
      var results = new app.CourseCollection(list);
    },

    addOne: function() {

    },
    addAll: function() {

    }
  });
})();

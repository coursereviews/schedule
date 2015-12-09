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
      "click .list-group-item": "doSearch",
      "change .form-group": "doSearch",
      "change .form-control": "doSearch"
    },

    doSearch: function(e) {
      var changed = $(e.currentTarget);

      if (changed.prop("tagName") === "SELECT") { changed = changed.find(":selected"); }
      else if (changed.attr("class") === "form-group") { changed = changed.find("input:checked")}
      else if (changed.prop("tagName") === "INPUT") { changed.attr('value', changed.val()) }

      var querystring = 'query?';
      $('.results-list').empty();

      if (changed.attr('class') === 'list-group-item' || 'form-control') {

        if ($('.active').length > 0) {$('.active').removeClass('active');}

        changed.addClass('active');
        querystring += changed.attr('id') +'=' +changed.attr('value');

        $.ajax({method: 'GET',
                url: '/api/catalog/'+querystring,
                dataType: 'json',
                context: this,
                success: function(r) { this.newCourseList(r); }
              });
        } else { changed.removeClass('active'); }
    },

    addList: function(course) {
      var reslist = this.$('.results-list');
			var view = new app.CourseView( {model: course} );
			this.$('.results-list').append(view.render().el);
		},

    newCourseList: function(list) {
      var self = this;
      list.forEach(function(elmt) {
        elmt = new app.CourseModel({
          title: elmt.title,
          code: elmt.code,
          instructor: elmt.instructor,
          department: elmt.department,
          location: elmt.location,
          requirements: elmt.requirements,
          term: elmt.term,
          type: elmt.type,
          schedule: elmt.schedule,
          description: elmt.description,
          crn: elmt.crn,
          href: elmt.href,
        });
        self.addList(elmt);
      });
    }

  });
})();

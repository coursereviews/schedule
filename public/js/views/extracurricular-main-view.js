var app = app || {};

(function() {
  'use strict';

  app.views.ExtraCurricularMainView = Backbone.View.extend({
    initialize: function() {

<<<<<<< 22faf8cdcf3344394834697d82ca3336e895329c
			this.listenTo(schedule.extracurriculars, 'reset', this.addAll);
		},
		render: function() {

		},
		addOne: function() {

		},
		addAll: function() {
			
			schedule.extracurriculars.each(this.addOne, this);
		}
	});
=======
      this.listenTo(app.collections.extracurriculars, 'reset', this.render);
    },
    render: function() {

    },
    addOne: function() {

    },
    addAll: function() {

    }
  });
>>>>>>> temp
})();

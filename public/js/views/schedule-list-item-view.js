var app = app || {};

(function() {
  'use strict';

  var ScheduleListItemView = Backbone.View.extend({
    tagName: 'a',

    className: 'list-group-item',

    template: _.template($('#schedule-list-item-template').html()),

    render: function() {
      this.$el.html(this.template({
        name: this.model.get('name'),
        term: this.model.get('term').code,
        created_at: new Date(this.model.get('created_at')).toLocaleDateString()
      }));
      this.$el.prop('href', '#schedule/' + this.model.get('id'));

      return this;
    }
  });

  app.ScheduleListItemView = ScheduleListItemView;
})();

/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
], function($, _, Backbone) {
  'use strict';

  var AppView = Backbone.View.extend({
    el: '#todoapp',
    template: _.template(''),
  });

  return AppView;
});

/*global require*/
'use strict';

require.config({
  shim: {
    underscore: {
      exports: '_',
    },
    backbone: {
      deps: [
				'underscore',
				'jquery',
			],
      exports: 'Backbone',
    },
  },
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery.min',
    'underscore': '../bower_components/underscore/underscore-min',
    'backbone': '../bower_components/backbone/backbone-min',
    // text: '../node_modules/requirejs-text/text'
  },
});

require([
	'backbone',
	'views/app',
	'routers/router',
], function(Backbone, AppView, Workspace) {

  new AppView();
  new Workspace();
});

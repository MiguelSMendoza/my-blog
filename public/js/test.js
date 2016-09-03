(function() {
	'use strict';
	var app = angular.module('admin', ['ui.router']);
	app.controller('MainController', MainController);
	app.config(function($stateProvider, $urlRouterProvider) {
	  $urlRouterProvider.otherwise("/");

	  $stateProvider
			.state('home', {
	      url: "/home",
	      templateUrl: "public/views/home.html",
	      abstract: true
	    }).state('home.main', {
	      url: "/main",
	      templateUrl: "public/views/main.html",
	      controller: 'MainController'
	    });
	});
	
	function MainController($scope) {
		$scope.message = "Bienvenido a la Zona de Administración";
  }
	
})();	
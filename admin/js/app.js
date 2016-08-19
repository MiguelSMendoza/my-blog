'use strict';
(function() {
	var blog = angular.module('admin', ['textAngular', 'ngRoute']);
	blog.service('NewsService', NewsService);
	blog.controller('EditController', EditController);
	blog.controller('MainController', MainController);
	
	blog.config(function($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'admin/views/home.html',
			controller: 'MainController'
		}).when('/edit', {
			templateUrl: 'admin/views/edit.html',
			controller: 'EditController'
		}).otherwise({
			redirectTo: '/'
		});
	});

	function NewsService($http, $q) {
		this.getNews = function() {
			var defered = $q.defer();
			var promise = defered.promise;
			$http.get('/news').then(function(res) {
				defered.resolve(res.data.news);
			});
			return promise;
		};
		this.saveNew = function(data) {
			var defered = $q.defer();
			var promise = defered.promise;
			$http.post('/news', data).then(function(res) {
				defered.resolve(res.data);
			});
			return promise;
		};
	}

	function MainController($scope) {
		$scope.message = "Bienvenido a la Zona de Administración";
	}

	function EditController($scope, NewsService) {
		$scope.newEntry = function() {
			var entry = {
				"title": $scope.title,
				"content": $scope.htmlContent,
				"author": "Miguel S. Mendoza",
				"date": (new Date).getTime()
			};
			NewsService.saveNew(entry).then(function(data) {
				console.log(data);
			});
		};
	}
})();
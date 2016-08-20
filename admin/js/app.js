'use strict';
(function() {
	var blog = angular.module('admin', ['textAngular', 'ngRoute']);
	blog.service('EntriesService', EntriesService);
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

	function EntriesService($http, $q) {
		this.getEntries = function() {
			var defered = $q.defer();
			var promise = defered.promise;
			$http.get('/api/entries').then(function(res) {
				defered.resolve(res.data);
			});
			return promise;
		};
		this.saveEntry = function(data) {
			var defered = $q.defer();
			var promise = defered.promise;
			$http.post('/api/entries', data).then(function(res) {
				defered.resolve(res.data);
			});
			return promise;
		};
	}

	function MainController($scope) {
		$scope.message = "Bienvenido a la Zona de Administración";
	}

	function EditController($scope, EntriesService) {
		$scope.newEntry = function() {
			var entry = {
				"title": $scope.title,
				"content": $scope.htmlContent,
				"author": "Miguel S. Mendoza",
				"date": (new Date).getTime()
			};
			EntriesService.saveEntry(entry).then(function(data) {
				if(data!==undefined) {
					toastr.success('Entrada almacenada correctamente.', 'Guardado');
				} else {
					toastr.error('Ha ocurrido un error guardando la noticia.', 'Error');
				}
			});
		};
	}
})();
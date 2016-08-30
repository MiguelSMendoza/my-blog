'use strict';
(function() {
	var blog = angular.module('private', ['textAngular', 'ngRoute']);
	blog.service('EntriesService', EntriesService);
	blog.controller('EditController', EditController);
	blog.controller('EntriesController', EntriesController);
	blog.controller('MainController', MainController);
	
	blog.config(function($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'private/views/home.html',
			controller: 'MainController'
		}).when('/edit/:idEntry?', {
			templateUrl: 'private/views/edit.html',
			controller: 'EditController'
		}).when('/entries', {
			templateUrl: 'private/views/entries.html',
			controller: 'EntriesController'
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
		this.getEntry = function(idEntry) {
			var defered = $q.defer();
			var promise = defered.promise;
			$http.get('/api/entries/'+idEntry).then(function(res) {
				defered.resolve(res.data);
			});
			return promise;
		};
	}

	function MainController($scope) {
		$scope.message = "Bienvenido a la Zona de Administración";
	}

	function EntriesController($scope, EntriesService) {
		var months = [
		  "Enero", "Febrero", "Marzo",
		  "Abril", "Mayo", "Junio", "Julio",
		  "Agosto", "Septiembre", "Octubre",
		  "Noviembre", "Diciembre"
		];
		var loadEntries = function() {
				EntriesService.getEntries().then(function(data) {
					var entries = [];
					for(var i=0;i<data.length;i++) {
						entries[i] = data[i];
						var date = new Date(parseInt(entries[i].date));
						var day = date.getDate();
						var monthIndex = date.getMonth();
						var year = date.getFullYear();
						entries[i].date = months[monthIndex]+ ' '+ day + ', '+year;
					}
					$scope.entries = entries;
				});
			}
		loadEntries();
	}

	function EditController($scope, $routeParams, EntriesService) {
		if($routeParams.idEntry !== undefined) {
			$scope.idEntry = $routeParams.idEntry;
			EntriesService.getEntry($scope.idEntry)
				.then(function(data) {
					$scope.title=data.title;
					$scope.htmlContent = data.content;
					$scope.date = data.date;
				});
		} else {
			$scope.idEntry = 0;
		}		
		$scope.saveEntry = function() {
			var entry = {
				"idEntry": $scope.idEntry,
				"title": $scope.title,
				"content": $scope.htmlContent,
				"author": "Miguel S. Mendoza",
				"date": $scope.date ? $scope.date : (new Date).getTime()
			};
			EntriesService.saveEntry(entry).then(function(data) {
				if(data!==undefined) {
					toastr.success('Entrada almacenada correctamente.', 'Guardado');
					$scope.idEntry = data._id;
				} else {
					toastr.error('Ha ocurrido un error guardando la noticia.', 'Error');
				}
			});
		};
	}
})();
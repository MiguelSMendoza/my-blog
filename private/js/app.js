(function() {
	'use strict';
	var app = angular.module('private', ['textAngular', 'ui.router', 'oc.lazyLoad']);
	app.service('EntriesService', EntriesService);
	app.controller('EditController', EditController);
	app.controller('EntriesController', EntriesController);
	app.controller('MainController', MainController);
	
	app.config(function($stateProvider, $urlRouterProvider) {
	  //
	  // For any unmatched url, redirect to /state1
	  $urlRouterProvider.otherwise("/home");
	  //
	  // Now set up the states
	  $stateProvider
	    .state('home.edit', {
	      url: "/edit/:idEntry?",
	      templateUrl: "private/views/edit.html",
	      controller: 'EditController'
	    }).state('home.entries', {
	      url: "/entries",
	      templateUrl: "private/views/entries.html",
	      controller: 'EntriesController'
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

	function EditController($scope, $state, EntriesService) {
		if($state.params.idEntry !== undefined) {
			$scope.idEntry = $state.params.idEntry;
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
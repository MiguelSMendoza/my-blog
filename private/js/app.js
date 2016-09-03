(function() {
	'use strict';
	var app = angular.module('admin', ['ui.router']);
	app.service('EntriesService', EntriesService);
	app.controller('EditController', EditController);
	app.controller('EntriesController', EntriesController);
	app.controller('LoginController', LoginController);
	app.controller('LogoutController', LogoutController);
	app.controller('MainController', MainController);
	
	app.run(function($auth, $state) {
		if(!$auth.isAuthenticated()) {
			$state.go('login');
		} else {
			$state.go('home');
		}
	});
	
	app.config(function($authProvider) {
		var full = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
        $authProvider.loginUrl = full + "/auth/login";
        $authProvider.tokenName = "token";
        $authProvider.tokenPrefix = "SMendoza";
    });
    
  app.config(function($stateProvider, $urlRouterProvider) {
	  $urlRouterProvider.otherwise("/");

	  $stateProvider
	    .state('login', {
	      url: "/login",
	      templateUrl: "public/login.html",
	      controller: 'LoginController'
	    }).state('home', {
	      url: "/home",
	      templateUrl: "public/views/home.html",
	      abstract: true
	    }).state('home.main', {
	      url: "/home",
	      templateUrl: "public/views/main.html",
	      abstract: true
	    }).state('home.edit', {
	      url: "/edit/:idEntry?",
	      templateUrl: "public/views/edit.html",
	      controller: 'EditController'
	    }).state('home.entries', {
	      url: "/entries",
	      templateUrl: "public/views/entries.html",
	      controller: 'EntriesController'
	    });
	});
	
	function MainController($scope, $auth, $state, $ocLazyLoad) {
		if(!$auth.isAuthenticated()) {
			$state.go('login');
			return;
		} 
		$scope.logout = function() {
			$auth.logout();
			$state.go('login');
		};
	}
    

	function LoginController($scope, $auth, $state, $ocLazyLoad) {  
	    $scope.login = function(){
	        $auth.login({
	            email: $scope.email,
	            password: $scope.password
	        })
	        .then(function(){
		        $state.go('home');
	        })
	        .catch(function(response){
	            console.log(response);
	        });
	    };
	}
	
	function LogoutController($auth, $location) {  
	    $auth.logout()
	        .then(function() {
	            $location.path("/");
	        });
	}

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

	function EntriesController($scope, $auth, EntriesService) {
		if(!$auth.isAuthenticated()) {
			$state.go('login');
			return;
		} 
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

	function EditController($scope, $auth, $state, EntriesService) {
		if(!$auth.isAuthenticated()) {
			$state.go('login');
			return;
		} 
		if($state.params.idEntry) {
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
(function() {
	'use strict';
	var app = angular.module('admin', ['textAngular', 'satellizer', 'ui.router','oc.lazyLoad']);
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
	  //
	  // For any unmatched url, redirect to /state1
	  $urlRouterProvider.otherwise("/");
	  //
	  // Now set up the states
	  $stateProvider
	    .state('login', {
	      url: "/login",
	      templateUrl: "public/login.html",
	      controller: 'LoginController'
	    }).state('home', {
	      url: "/home",
	      templateUrl: "private/views/home.html", 
	      controller: "MainController"
	    }).state('home.edit', {
	      url: "/edit/:idEntry?",
	      templateUrl: "private/views/edit.html",
	      controller: 'EditController'
	    }).state('home.entries', {
	      url: "/entries",
	      templateUrl: "private/views/entries.html",
	      controller: 'EntriesController'
	    });
	});
	
	function MainController($scope, $auth, $state, $ocLazyLoad) {
		if(!$auth.isAuthenticated()) {
			$state.go('login');
			return;
		} 
		$ocLazyLoad.load('/private/js/app.js');
		$ocLazyLoad.load('/private/css/styles.css');
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
})();
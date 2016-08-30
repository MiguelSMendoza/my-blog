(function() {
	'use strict';
	var app = angular.module('admin', ['satellizer', 'ui.router','oc.lazyLoad']);
	app.controller('LoginController', LoginController);
	app.controller('LogoutController', LogoutController);
	
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
	    })
	    .state('home', {
	      url: "/home",
	      templateUrl: "private/views/home.html"
	    });
	});
    

	function LoginController($scope, $auth, $state, $ocLazyLoad) {  
	    $scope.login = function(){
	        $auth.login({
	            email: $scope.email,
	            password: $scope.password
	        })
	        .then(function(){
		        $ocLazyLoad.load('/private/js/app.js');
		        $ocLazyLoad.load('/private/css/styles.css');
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
(function() {
	'use strict';
	var login = angular.module('admin', ['satellizer', 'ngRoute']);
	login.controller('LoginController', LoginController);
	login.controller('LogoutController', LogoutController);
	
	login.config(function($authProvider) {
		var full = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
        $authProvider.loginUrl = full + "/auth/login";
        $authProvider.tokenName = "token";
        $authProvider.tokenPrefix = "SMendoza";
    });
    
    login.config(function($routeProvider, $locationProvider) {
		$routeProvider.when('/login', {
			templateUrl: 'private/login.html',
			controller: 'LoginController'
		}).when('/private', {
			templateUrl: 'private/index.html',
			controller: 'LoginController'
		}).otherwise({
			redirectTo: '/'
		});
	});

	function LoginController($scope, $auth, $location) {  
	    $scope.login = function(){
	        $auth.login({
	            email: $scope.email,
	            password: $scope.password
	        })
	        .then(function(){
		        var url = window.location.href;
		        var arr = url.split("/");
	            window.location.replace(arr[0]+"/private?token="+$auth.getToken());
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
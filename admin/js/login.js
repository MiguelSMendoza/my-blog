(function() {
	'use strict';
	var login = angular.module('admin', ['satellizer']);
	login.controller('LoginController', LoginController);
	login.controller('LogoutController', LogoutController);
	
	login.config(function($authProvider) {
        $authProvider.loginUrl = "http://localhost:8080/auth/login";
        $authProvider.tokenName = "token";
        $authProvider.tokenPrefix = "SMendoza";
    });

	function LoginController($scope, $auth, $location) {  
	    $scope.login = function(){
	        $auth.login({
	            email: $scope.email,
	            password: $scope.password
	        })
	        .then(function(){
	            $location.path("/admin")
	        })
	        .catch(function(response){
	            console.log(response);
	        });
	    }
	}
	
	function LogoutController($auth, $location) {  
	    $auth.logout()
	        .then(function() {
	            $location.path("/")
	        });
	}
})();
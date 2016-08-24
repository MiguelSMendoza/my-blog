'use strict';
(function() {
	var login = angular.module('admin', ['satellizer']]);
	login.service('LoginService', LoginService);
	login.controller('LoginController', LoginController);
	
	login.config(function($authProvider) {
        // Parametros de configuración
        $authProvider.loginUrl = "http://localhost:8080/auth/login";
        $authProvider.tokenName = "token";
        $authProvider.tokenPrefix = "SMendoza",
    });

	function LoginController($scope, $auth, $location) {  
	    this.login = function(){
	        $auth.login({
	            email: $scope.email,
	            password: $scope.password
	        })
	        .then(function(){
	            $location.path("/admin")
	        })
	        .catch(function(response){
	            // Si ha habido errores llegamos a esta parte
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
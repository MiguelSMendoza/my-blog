'use strict';
(function() {
	var blog = angular.module('login', []);
	blog.service('LoginService', LoginService);
	blog.controller('LoginController', LoginController);

	function LoginService($http, $q) {
		this.getNews = function() {
			var defered = $q.defer();
			var promise = defered.promise;
			$http.get('/api/entries').then(function(res) {
				defered.resolve(res.data);
			});
			return promise;
		}
	}

	function LoginController($scope, EntriesService) {

	}
})();
'use strict';
(function() {
	var blog = angular.module('admin', ['textAngular']);
	blog.service('NewsService', NewsService);
	blog.controller('EditController', EditController);

	function NewsService($http, $q) {
		this.getNews = function() {
			var defered = $q.defer();
			var promise = defered.promise;
			$http.get('/news').then(function(res) {
				defered.resolve(res.data.news);
			});
			return promise;
		};
		this.saveNew = function(data) {
			var defered = $q.defer();
			var promise = defered.promise;
			$http.post('/news',data).then(function(res) {
				defered.resolve(res.data.status);
			});
			return promise;
		};
	}

	function EditController($scope, $sce, NewsService) {
		$scope.newEntry = function() {
			var entry = {
				"title": $scope.title,
				"content": $scope.htmlContent,
				"author": "Miguel S. Mendoza",
				"date": (new Date).getTime()
			};
			NewsService.saveNew(entry).then(function(data) {
				console.log(data);
			});
		}
	}
})();
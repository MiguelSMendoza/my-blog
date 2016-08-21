'use strict';
(function() {
	var blog = angular.module('blog', ['ngSanitize']);
	blog.service('EntriesService', EntriesService);
	blog.controller('EntriesController', EntriesController);

	function EntriesService($http, $q) {
		this.getNews = function() {
			var defered = $q.defer();
			var promise = defered.promise;
			$http.get('/api/entries').then(function(res) {
				defered.resolve(res.data);
			});
			return promise;
		}
	}

	function EntriesController($scope, EntriesService) {
		var months = [
		  "Enero", "Febrero", "Marzo",
		  "Abril", "Mayo", "Junio", "Julio",
		  "Agosto", "Septiembre", "Octubre",
		  "Noviembre", "Diciembre"
		];
		var loadNews = function() {
				EntriesService.getNews().then(function(data) {
					var news = [];
					for(var i=0;i<data.length;i++) {
						news[i] = data[i];
						var date = new Date(parseInt(news[i].date));
						var day = date.getDate();
						var monthIndex = date.getMonth();
						var year = date.getFullYear();
						news[i].date = day + ' de ' + months[monthIndex] + ', '+year;
					}
					$scope.news = news;
				});
			}
		loadNews();
	}
})();
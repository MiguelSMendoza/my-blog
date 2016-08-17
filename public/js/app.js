'use strict';
(function() {
	var blog = angular.module('blog', []);
	blog.service('NewsService', NewsService);
	blog.controller('NewsController', NewsController);

	function NewsService($http, $q) {
		this.getNews = function() {
			var defered = $q.defer();
			var promise = defered.promise;
			$http.get('/news').then(function(res) {
				defered.resolve(res.data.news);
			});
			return promise;
		}
	}

	function NewsController($scope, $sce, NewsService) {
		var months = [
		  "Enero", "Febrero", "Marzo",
		  "Abril", "Mayo", "Junio", "Julio",
		  "Agosto", "Septiembre", "Octubre",
		  "Noviembre", "Diciembre"
		];
		var loadNews = function() {
				NewsService.getNews().then(function(data) {
					var news = [];
					for(var i=0;i<data.length;i++) {
						news[i] = data[i];
						var date = new Date(parseInt(news[i].date)*1000);
						var day = date.getDate();
						var monthIndex = date.getMonth();
						var year = date.getFullYear();
						news[i].date = months[monthIndex]+ ' '+ day + ', '+year;
						
						news[i].content = $sce.trustAsHtml(news[i].content);
					}
					$scope.news = news;
				});
			}
		loadNews();
	}
})();
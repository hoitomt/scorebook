var app = angular.module('scorebook', ['ngRoute', 'ngMessages']);

app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/pages/home.html',
      controller: 'mainController'
    })
    .when('/game/:id', {
      templateUrl: 'app/pages/game.html',
      controller: 'gameController',
      routeName: 'game'
    })
    .otherwise({
      redirectTo: '/'
    });
});

// Runs before anything else in the app
app.run(function($rootScope) {

});

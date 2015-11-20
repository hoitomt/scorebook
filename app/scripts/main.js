var app = angular.module('scorebook', ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'pages/home.html',
      controller: 'mainController'
    })
    .when('/game', {
      templateUrl: 'pages/game.html',
      controller: 'gameController',
      routeName: 'game'
    })
    .when('/game/:id', {
      templateUrl: 'pages/game.html',
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

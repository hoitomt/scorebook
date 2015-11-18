var app = angular.module('scorebook', ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/pages/home.html',
      controller: 'mainController'
    })
    .when('/game', {
      templateUrl: '/pages/game.html',
      controller: 'gameController'
    })
    // .when('/game/:game_id', {
    //   tempateUrl: 'pages/game.html',
    //   controller: 'gameController'
    // })
    .otherwise({
      redirectTo: '/'
    });
});

// Runs before anything else in the app
app.run(function($rootScope) {

});

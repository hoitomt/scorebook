var app = angular.module('scorebook', ['ngRoute', 'ngMessages', 'ngCookies']);

app.constant('Config', {
  'DB_NAME': 'scorebook'
})

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
    .when('/login', {
      templateUrl: 'app/pages/login.html',
      controller: 'loginController'
    })
    .when('/logout', {
      templateUrl: 'app/pages/login.html',
      controller: 'loginController',
      routeName: 'logout'
    })
    .when('/register', {
      templateUrl: 'app/pages/register.html',
      controller: 'registerController'
    })
    .when('/teams/new', {
      templateUrl: 'app/pages/teams/new.html',
      controller: 'teamsController'
    })
    .when('/teams/:id', {
      templateUrl: 'app/pages/teams/edit.html',
      controller: 'teamsController',
      routeName: 'team'
    })
    .otherwise({
      redirectTo: '/'
    });
});

// Copied from this guy: http://arthur.gonigberg.com/2013/06/29/angularjs-role-based-auth/
app.run(function ($rootScope, RouteService) {
  RouteService.authenticate();
});

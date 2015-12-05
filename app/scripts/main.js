var app = angular.module('scorebook', ['ngRoute', 'ngMessages', 'ngCookies']);

var host = 'http://localhost:3000';

app.constant('Config', {
  'DB_NAME': 'scorebook',
  'AUTH_URL': host + '/api/v1/authentication'
})

app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/pages/home.html',
      controller: 'mainController'
    })
    .when('/games/new', {
      templateUrl: 'app/pages/games/new.html',
      controller: 'gamesController'
    })
    .when('/games/:id', {
      templateUrl: 'app/pages/games/edit.html',
      controller: 'gamesController',
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
    .when('/sync', {
      templateUrl: 'app/pages/sync.html',
      controller: 'syncController'
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

  if(window.applicationCache.onchecking) {
    window.applicationCache.onchecking(function(){
      console.log("Checking the application cache");
    });

    window.applicationCache.ondownloading(function(){
      console.log("Downloading the files");
    });

    window.applicationCache.onprogress(function(){
      console.log("Making Progress downloading the files");
    });

    window.applicationCache.oncached(function(){
      console.log("All of the files have been cached");
    });
  }

});

var app = angular.module('scorebook', ['ngRoute', 'ngMessages', 'ngCookies']);

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
    .otherwise({
      redirectTo: '/'
    });
});

// Copied from this guy: http://arthur.gonigberg.com/2013/06/29/angularjs-role-based-auth/
app.run(function ($rootScope, $location, AuthenticationService, NetworkSnifferService) {

  // enumerate routes that don't need authentication
  var routesThatDontRequireAuth = ['/login'];

  // check if current location matches route
  var routeClean = function (route) {
    return _.find(routesThatDontRequireAuth,
      function (noAuthRoute) {
        return s.startsWith(route, noAuthRoute);
      });
  };

  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    // if route requires auth and user is not logged in
    if (!routeClean($location.url()) && !AuthenticationService.isAuthenticated()) {

      NetworkSnifferService.testConnection().then(function(resolve) {
        console.log("The device is connected");
        // redirect back to login
        $location.path('/login');
      }, function(reject) {
        // Do not redirect to a login page if there isn't a connection - assume authenticated
        console.log("The device is not connected");
      });
    }
  });
});

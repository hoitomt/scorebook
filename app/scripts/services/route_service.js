app.factory('RouteService', function($rootScope, $cookies, $location, AuthenticationService, NetworkSnifferService) {
  var RouteService = {
    authenticate: function () {

      // enumerate routes that don't need authentication
      var routesThatDontRequireAuth = ['/login', '/register'];

      // check if current location matches route
      var routeClean = function (route) {
        return _.find(routesThatDontRequireAuth,
          function (noAuthRoute) {
            return s.startsWith(route, noAuthRoute);
          });
      };

      $rootScope.$on('$routeChangeStart', function (event, next, current) {
        // Set LoggedIn variable - used to control display
        if($cookies.get('apiKey')) {
          $rootScope.isLoggedIn = true;
        } else {
          $rootScope.isLoggedIn = false;
        }

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
    }

  }

  return RouteService;
});

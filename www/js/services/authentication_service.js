app.factory('AuthenticationService', function($cookies, $location, NetworkSnifferService) {

  var AuthenticationService = {
    isAuthenticated: function() {
      console.log("Check for Api Key");
      if($cookies.get('apiKey')) {
        return true
      } else {
        return false;
      }
    },
    authenticate: function (toState) {
      console.log("Attempt Authentication")
      // if route requires auth and user is not logged in
      if (toState.authenticate && !this.isAuthenticated()) {
        console.log("Test the connection");
        NetworkSnifferService.testConnection().then(function(resolve) {
          console.log("The device is connected");
          // redirect back to login
          $location.path('/login');
        }, function(reject) {
          // Do not redirect to a login page if there isn't a connection - assume authenticated
          console.log("The device is not connected");
        });
      }
    }
  }

  return AuthenticationService;
});


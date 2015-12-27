app.factory('AuthenticationService', function($cookies, $location, NetworkSnifferService) {

  var AuthenticationService = {
    isAuthenticated: function() {
      if($cookies.get('apiKey')) {
        console.log("Check for Api Key - True");
        return true
      } else {
        console.log("Check for Api Key - False");
        return false;
      }
    },
    authenticate: function (toState) {
      console.log("Start Authentication");
      // if route requires auth and user is not logged in
      if (toState.authenticate && !this.isAuthenticated()) {
        // This makes it so the service doesn't attempt to contact the server between every request if we are offline
        if(!NetworkSnifferService.isConnected()) {
          console.log("Do not attempt to reach the server - we already know it is offline");
          return;
        }
        NetworkSnifferService.testConnection().then(function(resolve) {
          console.log("The device is connected");
          // redirect back to login
          // $location.path('/login');
        }, function(reject) {
          // Do not redirect to a login page if there isn't a connection - assume authenticated
          console.log("The device is not connected");
        });
      }
    }
  }

  return AuthenticationService;
});


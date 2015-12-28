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
    authenticate: function (toState, isConnected) {
      console.log("Start Authentication");
      // if route requires auth and user is not logged in
      if (toState.authenticate && !this.isAuthenticated()) {
        // This makes it so the service doesn't attempt to contact the server between every request if we are offline
        if(isConnected) {
          // redirect back to login
          // $location.path('/login');
        } else {
          console.log("Do not attempt to reach the server - we already know it is offline");
          return;
        }
      }
    }
  }

  return AuthenticationService;
});


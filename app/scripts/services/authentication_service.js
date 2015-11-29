app.factory('AuthenticationService', function($cookies, UserFactory, NetworkSnifferService) {
  var AuthenticationService = {
    isAuthenticated: function() {
      console.log("Check Logged In Status");

      if($cookies.get('apiKey')) {
        // At some point we may want to re-validate the api key, but for now just check for presence
        return true
      } else {
        return false;
      }
    }
  };

  return AuthenticationService;
});

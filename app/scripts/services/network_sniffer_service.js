app.factory('NetworkSnifferService', function($http, $q, $cookies, Config) {
  var NetworkSnifferService = {
    testConnection: function() {
      console.log("Test the connection");
      var deferred = $q.defer();

      $http.get(Config.AUTH_URL)
        .then(function(response){
          console.log("Client is connected: ", response);
          $cookies.put('connected', 'true');
          deferred.resolve();
        },
        function(response) {
          console.log("Client is not connected: ", response);
          $cookies.put('connected', 'false');
          deferred.reject();
        }
      );
      return deferred.promise;
    }
  };

  return NetworkSnifferService;
});

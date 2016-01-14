app.factory('NetworkSnifferService', function($http, $q, $cookies, Config) {
  var NetworkSnifferService = {
    isConnected: function() {
      return $cookies.get('connected') != 'false';
    },
    testConnection: function() {
      console.log("Test the connection");
      var deferred = $q.defer();

      $http.get(Config.url_auth)
        .then(function(response){
          console.log("Client is connected: ", response);
          $cookies.put('connected', 'true');
          deferred.resolve({connected: true});
        },
        function(response) {
          console.log("Client is not connected: ", response);
          $cookies.put('connected', 'false');
          deferred.reject({connected: false});
        }
      );
      return deferred.promise;
    }


  };

  return NetworkSnifferService;
});

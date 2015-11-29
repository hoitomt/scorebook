app.factory('NetworkSnifferService', function($http, $q) {
  var NetworkSnifferService = {
    testConnection: function() {
      console.log("Test the connection");
      var deferred = $q.defer();

      $http.get('https://s3.amazonaws.com/hoitomt-scorebook/dummy.css')
        .then(function(response){
          console.log("Client is connected: ", response);
          deferred.resolve();
        },
        function(response) {
          console.log("Client is not connected: ", response);
          deferred.reject();
        }
      );
      return deferred.promise;
    }
  };

  return NetworkSnifferService;
});

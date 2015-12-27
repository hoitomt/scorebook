app.factory('SyncService', function($http, $q, $cookies, Config) {
  var config = {
    headers: {
      'Authorization': 'Token token=' + $cookies.get('apiKey')
    }
  };
  var SyncService = {
    get: function(team) {

    },
    postTeam: function(team) {
      console.log("POST a new team");
      var deferred = $q.defer();
      $http.post(Config.url_team, {team: team.syncValues()}, config)
        .then(function(response){
          console.log("Success Response: ", response);
          deferred.resolve(response.data);
        },
        function(response) {
          console.log("Error Response", response);
          deferred.reject(response.data.errors);
        }
      );
      return deferred.promise;
    },
    putTeam: function(team) {
      console.log("PUT a new team");
      var deferred = $q.defer();
      var url = Config.url_team + "/" + team.remoteId;
      $http.put(url, {team: team.syncValues()}, config)
        .then(function(response){
          console.log("Success Response: ", response);
          deferred.resolve(response.data);
        },
        function(response) {
          console.log("Error Response", response);
          deferred.reject(response.data.errors);
        }
      );
      return deferred.promise;

    }
  }

  return SyncService;
});

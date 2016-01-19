app.factory('SyncService', function($http, $q, $cookies, Config, TeamFactory) {
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

    },
    sync: function() {
      // Sync new teams with players
      TeamFactory.unsyncedTeams().then(function(teams){
        console.log("result");
      });


      // var teams = TeamFactory.teams();
      // $scope.isSyncing = true;
      // for(team of teams){
      //   console.log("Team: ", team);
      //   $scope.syncMessage = "Syncing Team:" + team.name
      //   team.sync();
      // }
      // $scope.isSyncing = false;
    }
  }

  return SyncService;
});

// Logic
// Select all teams where needs_sync = true and remote id is null
//   POST teams with players to API

// Select all teams where needs_sync = true and remote id is NOT null
//   PUT teams with players to API

// Select all games where needs_sync = true and remote id is null
//   POST games with box scores to API

// Select all games where needs_sync = true and remote id is NOT null
//   PUT games with box scores to API

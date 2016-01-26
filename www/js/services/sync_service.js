app.factory('SyncService', function($http, $q, $cookies, Config, TeamFactory, PlayerFactory) {
  var config = {
    headers: {
      'Authorization': 'Token token=' + $cookies.get('apiKey')
    }
  };

  var SyncService = {
    get: function(team) {

    },
    post: function(url, syncObject) {
      console.log("POST to", url);
      var deferred = $q.defer();
      $http.post(url, syncObject, config)
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
    put: function(url, syncObject) {
      console.log("PUT", url);
      var deferred = $q.defer();
      $http.put(url, syncObject, config)
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
        if(teams.length <= 0){
          return;
        }

        for(team of teams){
          PlayerFactory.players(team.rowid).then(function(players) {
            var syncObject = team.syncValues();
            if(players.length > 0){
              syncObject.players = new Array;
              for(player of players) {
                syncObject.players.push(player.syncValues());
              }
            }
            SyncService.syncTeam(syncObject).then(function(){
              console.log("Team Sync complete");
            });
          });
        }
      });


      // var teams = TeamFactory.teams();
      // $scope.isSyncing = true;
      // for(team of teams){
      //   console.log("Team: ", team);
      //   $scope.syncMessage = "Syncing Team:" + team.name
      //   team.sync();
      // }
      // $scope.isSyncing = false;
    },
    syncTeam: function(syncObject) {
      var deferred = $q.defer();

      if(syncObject.id) {
        var url = Config.url_team + "/" + syncObject.id;
        SyncService.put(url, {team: syncObject}).then(function(response) {
          SyncService.updatePlayersWithResponse(response).then(function() {
            deferred.resolve();
          });
        });
      } else {
        var url = Config.url_team;
        SyncService.post(url, {team: syncObject}).then(function(response) {
          TeamFactory.updateRemoteIdAndSync(response.remote_id, response.id).then(function(){
            console.log("Team Updated");
            SyncService.updatePlayersWithResponse(response).then(function() {
              deferred.resolve();
            })
          });
        });
      }
      return deferred.promise;
    },
    updatePlayersWithResponse: function(response) {
      var deferred = $q.defer();
      var playerPromises = new Array;
      if(response.players.length <= 0){
        deferred.resolve();
      }
      for(remotePlayer of response.players){
        playerPromises.push(PlayerFactory.updateRemoteId(remotePlayer.remote_id, remotePlayer.id));
      }
      Promise.all(playerPromises).then(function(){
        console.log("Players Updated");
        deferred.resolve();
      });
      return deferred.promise;
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

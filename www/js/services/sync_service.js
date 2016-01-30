app.factory('SyncService', function($http, $q, $cookies, Config, BoxScoreFactory, GameFactory, PlayerFactory, TeamFactory) {
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
      SyncService.syncTeams().then(function(){
        console.log("First part of sync complete");
        SyncService.syncGames().then(function(){
          console.log("Second part of sync complete");
        })
      });
    },
    syncGames: function() {
      var deferred = $q.defer();
      GameFactory.unsyncedGames().then(function(games){
        if(games.length <= 0) {
          deferred.resolve();
        }
        var gamePromises = new Array;
        for(game of games) {
          gamePromises.push(SyncService.retrieveBoxScoresAndSync(game));
        }
        Promise.all(gamePromises).then(function(){
          deferred.resolve();
        }, function(e){
          console.log("Sync ERROR", e);
          deferred.reject(e);
        })
        deferred.resolve();
      });
      return deferred.promise;
    },
    syncTeams: function() {
      var deferred = $q.defer();
      TeamFactory.unsyncedTeams().then(function(teams){
        if(teams.length <= 0){
          deferred.resolve();
        }
        var teamPromises = new Array;
        for(team of teams){
          teamPromises.push(SyncService.retrievePlayersAndSync(team));
        }
        Promise.all(teamPromises).then(function(){
          deferred.resolve();
        }, function(e){
          console.log("Sync ERROR", e);
          deferred.reject(e);
        });
      });
      return deferred.promise;
    },
    retrieveBoxScoresAndSync: function(game) {
      var deferred = $q.defer();
      BoxScoreFactory.boxScores(game.rowid).then(function(boxScores) {
        game.syncValues().then(function(syncObject) {
          if(boxScores.length > 0) {
            syncObject.box_scores = new Array;
            for(boxScore of boxScores) {
              syncObject.box_scores.push(boxScore.syncValues());
            }
          }
          SyncService.syncGame(syncObject).then(function(){
            console.log("Game Sync Complete");
            deferred.resolve();
          }, function(e){
            console.log("ERROR:", e);
            deferred.reject(e);
          });
        }, function(e){
          console.log("Game ERROR:", e);
          deferred.reject(e);
        });
      });

      return deferred.promise;
    },
    retrievePlayersAndSync: function(team) {
      var deferred = $q.defer();
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
          deferred.resolve();
        }, function(e){
          console.log("ERROR:", e);
          deferred.reject(e);
        });
      }, function(e){
        console.log("Player ERROR:", e);
        deferred.reject(e);
      });
      return deferred.promise;
    },
    syncGame: function(syncObject) {
      console.log("Game Sync Object id", syncObject.id);
      var deferred = $q.defer();
      if(syncObject.id) {
        var url = Config.url_game(syncObject.team_id, syncObject.id);
        SyncService.put(url, {game: syncObject}).then(function(response) {
          console.log("Game Updated");
          GameFactory.updateNeedsSync(response.device_id, 'false').then(function(){
            SyncService.updateGamesWithResponse(response).then(function() {
              deferred.resolve();
            });
          });
        });
      } else {
        var url = Config.url_game(syncObject.team_id);
        SyncService.post(url, {game: syncObject}).then(function(response){
          console.log("Game Created");
          GameFactory.updateRemoteIdAndSync(response.device_id, response.id).then(function(){
            SyncService.updateGamesWithResponse(response).then(function() {
              deferred.resolve();
            });
          });
        });
      }
      return deferred.promise;
    },
    syncTeam: function(syncObject) {
      console.log("Team SyncObject id", syncObject.id);
      var deferred = $q.defer();

      if(syncObject.id) {
        var url = Config.url_team(syncObject.id);
        SyncService.put(url, {team: syncObject}).then(function(response) {
          console.log("Team Updated");
          TeamFactory.updateNeedsSync(response.device_id, 'false').then(function(){
            SyncService.updatePlayersWithResponse(response).then(function() {
              deferred.resolve();
            });
          });
        });
      } else {
        var url = Config.url_team();
        SyncService.post(url, {team: syncObject}).then(function(response) {
          console.log("Team Created");
          TeamFactory.updateRemoteIdAndSync(response.device_id, response.id).then(function(){
            SyncService.updatePlayersWithResponse(response).then(function() {
              deferred.resolve();
            })
          });
        });
      }
      return deferred.promise;
    },
    updateGamesWithResponse: function(response) {
      var deferred = $q.defer();
      if(response.box_scores.length <= 0){
        deferred.resolve();
      }
      var gamePromises = new Array;
      for(remoteBoxScore of response.box_scores) {
        gamePromises.push(BoxScoreFactory.updateRemoteId(remoteBoxScore.device_id, remoteBoxScore.id));
      }
      Promise.all(gamePromises).then(function(){
        console.log("Games Updated in database");
        deferred.resolve();
      });
      return deferred.promise;
    },
    updatePlayersWithResponse: function(response) {
      var deferred = $q.defer();
      if(response.players.length <= 0){
        deferred.resolve();
      }
      var playerPromises = new Array;
      for(remotePlayer of response.players){
        playerPromises.push(PlayerFactory.updateRemoteId(remotePlayer.device_id, remotePlayer.id));
      }
      Promise.all(playerPromises).then(function(){
        console.log("Players Updated in database");
        deferred.resolve();
      });
      return deferred.promise;
    }
  }

  return SyncService;
});

// var teams = TeamFactory.teams();
// $scope.isSyncing = true;
// for(team of teams){
//   console.log("Team: ", team);
//   $scope.syncMessage = "Syncing Team:" + team.name
//   team.sync();
// }
// $scope.isSyncing = false;

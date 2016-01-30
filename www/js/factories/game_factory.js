app.factory('GameFactory', function($q, PlayerFactory, BoxScoreFactory, TeamFactory, DatabaseService) {
  var GameFactory = function(args) {
    this.rowid = args.rowid || null;
    this.remoteId = args.remoteId || args.remote_id || null;
    this.needsSync = args.needsSync || args.needs_sync || true;
    this.date = args.date;
    this.opponent = args.opponent;
    this.points = args.points || 0;
    this.fouls = args.fouls || 0;
    this.turnovers = args.turnovers || 0;
    this.teamId = args.teamId || args.team_id || null;
    this.players = new Array;

    this.inGamePlayers = new Array;
    this.benchPlayers = new Array;
    if(angular.isDefined(args.players) && args.players.length >= 0) {
      for(player of args.players) {
        this.players.push(new PlayerFactory(player));
      }
    }

    for(player of this.players) {
      if(player.inGame) {
        this.inGamePlayers.push(player)
      } else {
        this.benchPlayers.push(player);
      }
    }
  };

  GameFactory.find = function(gameId) {
    console.log("Retrieve game ", gameId);
    var deferred = $q.defer();

    DatabaseService.selectGame(gameId).then(function(res) {
      var game = null;
      if(res.rows.length >= 0) {
        game = new GameFactory(res.rows.item(0));
      }
      deferred.resolve(game);
    }, function(e) {
      deferred.reject(e);
    });

    return deferred.promise;
  };

  GameFactory.games = function(number) {
    var gameQuery = DatabaseService.selectGames;
    return this.queryForGames(gameQuery);
  };

  GameFactory.queryForGames = function(gameQuery) {
    console.log("Retrieve games");
    var deferred = $q.defer();

    gameQuery().then(function(res) {
      var gameArray = new Array;
      if(res.rows.length > 0) {
        var gamesParams = res.rows;
        for(var i = 0; i < gamesParams.length; i++) {
          gameArray.push(new GameFactory(gamesParams.item(i)));
        }
      }
      deferred.resolve(gameArray);
    }, function(e) {
      deferred.reject(e);
    });

    return deferred.promise;
  }

  GameFactory.updateRemoteIdAndSync = function(rowid, remoteId) {
    return DatabaseService.updateGameRemoteIdAndSync(rowid, remoteId);
  }

  GameFactory.updateNeedsSync = function(rowid, needsSync) {
    return DatabaseService.updateGameNeedsSync(rowid, needsSync);
  }

  GameFactory.unsyncedGames = function() {
    var gameQuery = DatabaseService.selectUnsyncedGames;
    return this.queryForGames(gameQuery);
  }

  GameFactory.prototype.createBoxScores = function() {
    var deferred = $q.defer();
    var insertPromises = new Array;
    var _this = this;
    PlayerFactory.players(this.teamId).then(function(players){
      for(player of players) {
        var boxScoreParams = {
          playerId: player.rowid,
          gameId: _this.rowid,
          playerName: player.name,
          playerNumber: player.number
        };
        var boxScore = new BoxScoreFactory(boxScoreParams);
        insertPromises.push(boxScore.save());
      }
      Promise.all(insertPromises).then(function(){
        console.log("All Inserts complete")
        deferred.resolve();
      }, function(e){
        console.log("ERROR: Box Score insert error: ", e)
        deferred.reject(e);
      });
    });
    return deferred.promise;
  }

  GameFactory.prototype.newRecord = function() {
    return !this.rowid;
  };

  GameFactory.prototype.resetFouls = function() {
    this.fouls = 0;
  };

  GameFactory.prototype.save = function() {
    console.log("Persist to WebSQL");
    if(this.newRecord()){
      var _this = this;
      DatabaseService.insertGame(this.values()).then(function(res) {
        _this.rowid = res.insertId;
      });
    } else {
      DatabaseService.updateGame(this.values());
    }
  };

  GameFactory.prototype.setNeedsSync = function(isNeedsSync) {
    this.needsSync = angular.isUndefined(isNeedsSync) ? true : isNeedsSync;
    this.save();
  };

  GameFactory.prototype.stats = function() {
    var points = "Points: " + this.points;
    var fouls = "Fouls: " + this.fouls;
    var turnovers = "Turnovers: " + this.turnovers;
    return points + ' ' + turnovers + ' ' + fouls;
  }

  GameFactory.prototype.team = function() {
    var deferred = $q.defer();
    TeamFactory.find(self.teamId).then(function(team){
      deferred.resolve(team);
    });
    return deferred.promise;
  }

  GameFactory.prototype.updatePlayerStatus = function() {
    this.inGamePlayers = this.players.filter(function(player) {
      return player.inGame;
    });

    this.benchPlayers = this.players.filter(function(player) {
      return !player.inGame;
    });

    this.save();
  }

  GameFactory.prototype.syncValues = function() {
    var deferred = $q.defer();
    var _this = this;
    TeamFactory.find(this.teamId).then(function(team){
      var v = {
        team_id: team.remoteId,
        date: _this.date,
        opponent: _this.opponent,
        device_id: _this.rowid,
        id: _this.remoteId
      };
      deferred.resolve(v);
    })
    return deferred.promise;
  }

  GameFactory.prototype.values = function() {
    return {
      teamId: this.teamId,
      date: this.date,
      opponent: this.opponent,
      players: this.players,
      points: this.points,
      fouls: this.fouls,
      turnovers: this.turnovers,
      remoteId: this.remoteId,
      rowid: this.rowid,
      needsSync: this.needsSync
    };
  };

  GameFactory.prototype.serializedValues = function() {
    return angular.toJson(this.values());
  };

  return GameFactory;
});

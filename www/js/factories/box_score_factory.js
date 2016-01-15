app.factory('BoxScoreFactory', function($q, DatabaseService) {

  var BoxScoreFactory = function(args) {
    this.rowid = args.rowid || 0;
    this.playerId = args.playerId || args.player_id || null;
    this.gameId = args.gameId || args.game_id || null;
    this.remoteId = args.remoteId || args.remote_id || null;
    this.onePointAttempts = args.onePointAttempts || args.one_point_attempts || 0;
    this.onePointMakes = args.onePointMakes || args.one_point_makes || 0;
    this.twoPointAttempts = args.twoPointAttempts || args.two_point_attempts || 0;
    this.twoPointMakes = args.twoPointMakes || args.two_point_makes || 0;
    this.threePointAttempts = args.threePointAttempts || args.three_point_attempts || 0;
    this.threePointMakes = args.threePointMakes || args.three_point_makes || 0;
    this.turnovers = args.turnovers || 0;
    this.rebounds = args.rebounds || 0;
    this.assists = args.assists || 0;
    this.fouls = args.fouls || 0;
    this.inGame = args.inGame || args.in_game || false;
  };

  BoxScoreFactory.boxScores = function(gameId) {
    console.log("Retrieve Box Scores for: ", gameId);
    var deferred = $q.defer();
    var boxScores = [];
    DatabaseService.selectBoxScores(gameId).then(function(res) {
      for(var i = 0; i < res.rows.length; i++) {
        var boxScore = new BoxScoreFactory(res.rows.item(i));
        boxScores.push(boxScore);
      }
      deferred.resolve(boxScores);
    }, function(e){
      console.log(e.message);
      deferred.reject(e);
    });
    return deferred.promise;
  };

  BoxScoreFactory.findPlayer = function(playerId) {
    console.log("Retrieve Player: ", playerId);
    var deferred = $q.defer();
    DatabaseService.selectPlayer(playerId).then(function(res) {
      player = new BoxScoreFactory(res.rows.item(0));
      deferred.resolve(player);
    }, function(e){
      console.log(e.message);
      deferred.reject(e);
    });
    return deferred.promise;
  }

  BoxScoreFactory.prototype.newRecord = function() {
    return angular.isUndefined(this.rowid) || this.rowid == 0;
  };

  BoxScoreFactory.prototype.getInGame = function() {
    if(this.inGame == "false" || this.inGame == 0 || !this.inGame) {
      return false;
    } else {
      return true;
    }
    return angular.isUndefined(this.rowid) || this.rowid == 0;
  };

  BoxScoreFactory.prototype.save = function() {
    console.log("Persist to WebSQL");
    if(this.newRecord()){
      var deferred = $q.defer();
      var _this = this;
      DatabaseService.insertBoxScore(this.values()).then(function(res) {
        _this.rowid = res.insertId;
        deferred.resolve(_this);
      });
      return deferred.promise;
    } else {
      return DatabaseService.updateBoxScore(this.values());
    }
  };

  BoxScoreFactory.prototype.newRecord = function() {
    return this.rowid == 0;
  };


  BoxScoreFactory.prototype.values = function() {
    return {
      playerId: this.playerId,
      gameId: this.gameId,
      remoteId: this.remoteId,
      onePointAttempts: this.onePointAttempts,
      onePointMakes: this.onePointMakes,
      twoPointAttempts: this.twoPointAttempts,
      twoPointMakes: this.twoPointMakes,
      threePointAttempts: this.threePointAttempts,
      threePointMakes: this.threePointMakes,
      turnovers: this.turnovers,
      rebounds: this.rebounds,
      assists: this.assists,
      fouls: this.fouls,
      inGame: this.inGame,
      rowid: this.rowid
    };
  };

  BoxScoreFactory.prototype.syncValues = function() {
    return {
      name: this.name,
      number: this.number,
      teamId: this.teamId,
      id: this.remoteId
    };
  };

  BoxScoreFactory.prototype.syncBoxScoreValues = function() {
    return {
      name: this.name,
      number: this.number,
      one_point_attempts: this.onePointAttempts,
      one_point_baskets: this.onePointMakes,
      two_point_attempts: this.twoPointAttempts,
      two_point_baskets: this.twoPointMakes,
      three_point_attempts: this.threePointAttempts,
      three_point_baskets: this.threePointMakes,
      turnovers: this.turnovers,
      rebounds: this.rebounds,
      assists: this.assists,
      fouls: this.fouls,
      inGame: this.inGame
    };
  };

  BoxScoreFactory.prototype.serializedValues = function() {
    return angular.toJson(this.values());
  };

  BoxScoreFactory.prototype.addScore = function(amount) {
    if(amount == 1) {
      this.onePointMakes += 1;
    } else if(amount == 2) {
      this.twoPointMakes += 1;
    } else if(amount == 3) {
      this.threePointMakes += 1;
    } else {
      // Unknown score amount
    }
    this.addShotAttempt(amount);
  }

  BoxScoreFactory.prototype.addShotAttempt = function(amount) {
    if(amount == 1) {
      this.onePointAttempts += 1;
    } else if(amount == 2) {
      this.twoPointAttempts += 1;
    } else if(amount == 3) {
      this.threePointAttempts += 1;
    } else {
      // Unknown attempt amount
    }
  }

  BoxScoreFactory.prototype.addRebound = function() {
    this.rebounds += 1;
  }

  BoxScoreFactory.prototype.addAssist = function() {
    this.assists += 1;
  }

  BoxScoreFactory.prototype.addTurnover = function() {
    this.turnovers += 1;
  }

  BoxScoreFactory.prototype.addFoul = function() {
    this.fouls += 1;
  }

  BoxScoreFactory.prototype.scoringLine = function() {
    var totalPoints = this.totalPoints() + ' points: '
    var twoPointers = '2: ' + this.twoPointMakes + '-' + this.twoPointAttempts;
    var threePointers = '3: ' + this.threePointMakes + '-' + this.threePointAttempts;
    var freeThrows = 'ft: ' + this.onePointMakes + '-' + this.onePointAttempts;
    return totalPoints + twoPointers + ' | ' + threePointers + ' | ' + freeThrows;
  }

  BoxScoreFactory.prototype.totalPoints = function() {
    return this.onePointMakes * 1 + this.twoPointMakes * 2 + this.threePointMakes * 3
  }

  BoxScoreFactory.prototype.removeScore = function(amount) {
    if(amount == 1) {
      this.onePointMakes = this.onePointMakes >= 1 ? this.onePointMakes - 1 : 0;
    } else if(amount == 2) {
      this.twoPointMakes = this.twoPointMakes >= 1 ? this.twoPointMakes - 1 : 0;
    } else if(amount == 3) {
      this.threePointMakes = this.threePointMakes >= 1 ? this.threePointMakes - 1 : 0;
    } else {
      // Unknown score amount
    }
    this.removeShotAttempt(amount);
  }

  BoxScoreFactory.prototype.removeShotAttempt = function(amount) {
    if(amount == 1) {
      this.onePointAttempts = this.onePointAttempts >= 1 ? this.onePointAttempts - 1 : 0;
    } else if(amount == 2) {
      this.twoPointAttempts = this.twoPointAttempts >= 1 ? this.twoPointAttempts - 1 : 0;
    } else if(amount == 3) {
      this.threePointAttempts = this.threePointAttempts >= 1 ? this.threePointAttempts - 1 : 0;
    } else {
      // Unknown attempt amount
    }
  }

  BoxScoreFactory.prototype.removeRebound = function() {
    this.rebounds = this.rebounds >= 1 ? this.rebounds - 1 : 0;
  }

  BoxScoreFactory.prototype.removeAssist = function() {
    this.assists = this.assists >= 1 ? this.assists - 1 : 0;
  }

  BoxScoreFactory.prototype.removeTurnover = function() {
    this.turnovers = this.turnovers >= 1 ? this.turnovers - 1 : 0;
  }

  BoxScoreFactory.prototype.removeFoul = function() {
    this.fouls = this.fouls >= 1 ? this.fouls - 1 : 0;
  }

  return BoxScoreFactory;
});

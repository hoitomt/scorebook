app.factory('PlayerFactory', function($q, DatabaseService) {

  var PlayerFactory = function(args) {
    this.rowid = args.rowid;
    this.name = args.name;
    this.number = args.number;
    this.teamId = args.teamId || args.team_id;
    this.remoteId = args.remoteId || args.remote_id || 0;
  };

  PlayerFactory.players = function(teamId) {
    console.log("Retrieve Players for: ", teamId);
    var deferred = $q.defer();
    var players = [];
    DatabaseService.selectPlayers(teamId).then(function(res) {
      for(var i = 0; i < res.rows.length; i++) {
        player = new PlayerFactory(res.rows[i]);
        players.push(player);
      }
      deferred.resolve(players);
    }, function(e){
      console.log(e.message);
      deferred.reject(e);
    });
    return deferred.promise;
  };

  PlayerFactory.findPlayer = function(playerId) {
    console.log("Retrieve Player: ", playerId);
    var deferred = $q.defer();
    DatabaseService.selectPlayer(teamId).then(function(res) {
      player = new PlayerFactory(res.rows[0]);
      deferred.resolve(player);
    }, function(e){
      console.log(e.message);
      deferred.reject(e);
    });
    return deferred.promise;
  }

  PlayerFactory.deletePlayer = function(playerId) {
    console.log("Delete Player: ", playerId);
    var deferred = $q.defer();
    DatabaseService.deletePlayer(playerId).then(function(res) {
      deferred.resolve();
    }, function(e){
      console.log(e.message);
    });
    return deferred.promise;
  }

  PlayerFactory.prototype.save = function() {
    console.log("Persist to Local Storage");
    if(this.newRecord()){
      var _this = this;
      var deferred = $q.defer();

      DatabaseService.insertPlayer(this.values()).then(function(res){
        _this.rowid = res.insertId;
        deferred.resolve(_this);
      });
      return deferred.promise;
    } else {
      return DatabaseService.updatePlayer(this.values());
    }
  };

  PlayerFactory.prototype.newRecord = function() {
    return angular.isUndefined(this.rowid) || this.rowid == 0;
  };

  PlayerFactory.prototype.values = function() {
    return {
      rowid: this.rowid,
      name: this.name,
      number: this.number,
      teamId: this.teamId,
      remoteId: this.remoteId
    };
  };

  PlayerFactory.prototype.syncValues = function() {
    return {
      name: this.name,
      number: this.number,
      teamId: this.teamId,
      id: this.remoteId
    };
  };

  PlayerFactory.prototype.syncBoxScoreValues = function() {
    return {
      name: this.name,
      number: this.number,
      one_point_attempts: this.onePointAttempts,
      one_point_baskets: this.onePointBaskets,
      two_point_attempts: this.twoPointAttempts,
      two_point_baskets: this.twoPointBaskets,
      three_point_attempts: this.threePointAttempts,
      three_point_baskets: this.threePointBaskets,
      turnovers: this.turnovers,
      rebounds: this.rebounds,
      assists: this.assists,
      fouls: this.fouls,
    };
  };

  PlayerFactory.prototype.serializedValues = function() {
    return angular.toJson(this.values());
  };

  PlayerFactory.prototype.addScore = function(amount) {
    if(amount == 1) {
      this.onePointBaskets += 1;
    } else if(amount == 2) {
      this.twoPointBaskets += 1;
    } else if(amount == 3) {
      this.threePointBaskets += 1;
    } else {
      // Unknown score amount
    }
    this.addShotAttempt(amount);
  }

  PlayerFactory.prototype.addShotAttempt = function(amount) {
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

  PlayerFactory.prototype.addRebound = function() {
    this.rebounds += 1;
  }

  PlayerFactory.prototype.addAssist = function() {
    this.assists += 1;
  }

  PlayerFactory.prototype.addTurnover = function() {
    this.turnovers += 1;
  }

  PlayerFactory.prototype.addFoul = function() {
    this.fouls += 1;
  }

  PlayerFactory.prototype.scoringLine = function() {
    var totalPoints = this.totalPoints() + ' points: '
    var twoPointers = '2: ' + this.twoPointBaskets + '-' + this.twoPointAttempts;
    var threePointers = '3: ' + this.threePointBaskets + '-' + this.threePointAttempts;
    var freeThrows = 'ft: ' + this.onePointBaskets + '-' + this.onePointAttempts;
    return totalPoints + twoPointers + ' | ' + threePointers + ' | ' + freeThrows;
  }

  PlayerFactory.prototype.totalPoints = function() {
    return this.onePointBaskets * 1 + this.twoPointBaskets * 2 + this.threePointBaskets * 3
  }

  PlayerFactory.prototype.removeScore = function(amount) {
    if(amount == 1) {
      this.onePointBaskets = this.onePointBaskets >= 1 ? this.onePointBaskets - 1 : 0;
    } else if(amount == 2) {
      this.twoPointBaskets = this.twoPointBaskets >= 1 ? this.twoPointBaskets - 1 : 0;
    } else if(amount == 3) {
      this.threePointBaskets = this.threePointBaskets >= 1 ? this.threePointBaskets - 1 : 0;
    } else {
      // Unknown score amount
    }
    this.removeShotAttempt(amount);
  }

  PlayerFactory.prototype.removeShotAttempt = function(amount) {
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

  PlayerFactory.prototype.removeRebound = function() {
    this.rebounds = this.rebounds >= 1 ? this.rebounds - 1 : 0;
  }

  PlayerFactory.prototype.removeAssist = function() {
    this.assists = this.assists >= 1 ? this.assists - 1 : 0;
  }

  PlayerFactory.prototype.removeTurnover = function() {
    this.turnovers = this.turnovers >= 1 ? this.turnovers - 1 : 0;
  }

  PlayerFactory.prototype.removeFoul = function() {
    this.fouls = this.fouls >= 1 ? this.fouls - 1 : 0;
  }

  return PlayerFactory;
});

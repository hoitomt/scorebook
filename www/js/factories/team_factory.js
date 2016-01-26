app.factory('TeamFactory', function($q, PlayerFactory, UserFactory, DatabaseService) {
  var localStorageIndexKey = 'teams_keys';

  var TeamFactory = function(args) {
    this.rowid = args.rowid || null;
    this.remoteId = args.remoteId || args.remote_id || null;
    this.needsSync = args.needsSync || args.needs_sync || true;
    this.name = args.name;
    this.userId = args.userId || UserFactory.userId() || 0;
  };

  TeamFactory.find = function(teamId) {
    console.log("Retrieve team ", teamId);
    var deferred = $q.defer();

    DatabaseService.selectTeam(teamId).then(function(res) {
      var team = null;
      if(res.rows.length >= 0) {
        team = new TeamFactory(res.rows.item(0));
      }
      deferred.resolve(team);
    }, function(e) {
      deferred.reject(e);
    });

    return deferred.promise;
  };

  TeamFactory.queryForTeams = function(teamQuery) {
    console.log("Retrieve all teams");
    var deferred = $q.defer();

    teamQuery().then(function(res) {
      var teamArray = new Array;
      if(res.rows.length > 0) {
        var teamsParams = res.rows;
        for(var i = 0; i < teamsParams.length; i++) {
          var team = teamsParams.item(i);
          teamArray.push(new TeamFactory(team));
        }
      }
      deferred.resolve(teamArray);
    }, function(e) {
      deferred.reject(e);
    });

    return deferred.promise;
  };

  TeamFactory.teams = function() {
    var teamQuery = DatabaseService.selectTeams;
    return this.queryForTeams(teamQuery);
  };

  TeamFactory.unsyncedTeams = function() {
    var teamQuery = DatabaseService.selectUnsyncedTeams;
    return this.queryForTeams(teamQuery);
  };

  TeamFactory.updateRemoteIdAndSync = function(rowid, remoteId) {
    return DatabaseService.updateTeamRemoteIdAndSync(rowid, remoteId);
  }

  TeamFactory.prototype.setNeedsSync = function(isNeedsSync) {
    this.needsSync = angular.isUndefined(isNeedsSync) ? true : isNeedsSync;
    this.save();
  }

  TeamFactory.prototype.newRecord = function() {
    return !this.rowid;
  };

  TeamFactory.prototype.save = function() {
    console.log("Persist to WebSQL");
    var deferred = $q.defer();
    if(this.newRecord()){
      var _this = this;
      DatabaseService.insertTeam(this.values()).then(function(res) {
        _this.rowid = res.insertId;
        deferred.resolve(_this);
      }, function(e) {
        deferred.reject(e)
      });
    } else {
      DatabaseService.updateTeam(this.values()).then(function(res) {
        deferred.resolve(_this);
      }, function(e) {
        deferred.reject(e)
      });
    }

    return deferred.promise;
  };

  TeamFactory.prototype.syncPlayers = function(playerData) {
    // sync the players
    for(player of this.players) {
      var remotePlayer = playerData.filter(function(p) {
        return p.number == player.number && p.name == player.name;
      })[0]
      if(remotePlayer) {
        console.log("Remote Player: ", remotePlayer);
        player.remoteId = remotePlayer.id;
      }
    }
  };

  TeamFactory.prototype.syncValues = function() {
    return {
      name: this.name,
      id: this.remoteId,
      remote_id: this.rowid
    };
  };

  TeamFactory.prototype.values = function() {
    return {
      // occurrence: this.occurrence,
      rowid: this.rowid,
      name: this.name,
      userId: this.userId,
      remoteId: this.remoteId,
      needsSync: this.needsSync
    };
  };

  return TeamFactory;
});

app.factory('TeamFactory', function($q, PlayerFactory, UserFactory, SyncService, DatabaseService) {
  var localStorageIndexKey = 'teams_keys';

  var TeamFactory = function(args) {
    this.rowid = args.rowid || 0;
    this.name = args.name;
    this.userId = args.userId || UserFactory.userId() || 0;
    this.remoteId = args.remoteId || 0;
  };

  TeamFactory.teams = function(number) {
    console.log("Retrieve all teams");
    var deferred = $q.defer();

    DatabaseService.selectTeams().then(function(res) {
      var teamArray = new Array;
      if(res.rows.length == 0) return;
      var teamsParams = res.rows;
      for(var i = 0; i < teamsParams.length; i++) {
        team = teamsParams[i];
        teamArray.push(new TeamFactory(team));
      }
      deferred.resolve(teamArray);
    }, function(e) {
      deferred.reject(e);
    });

    return deferred.promise;
  };

  TeamFactory.find = function(teamId) {
    console.log("Retrieve team ", teamId);
    var deferred = $q.defer();

    DatabaseService.selectTeam(teamId).then(function(res) {
      if(res.rows.length == 0) return;
      var team = new TeamFactory(res.rows[0]);
      deferred.resolve(team);
    }, function(e) {
      deferred.reject(e);
    });

    return deferred.promise;
  };

  TeamFactory.prototype.save = function() {
    console.log("Persist to Local Storage");
    if(this.newRecord){
      var _this = this;
      DatabaseService.insertTeam(this.values()).then(function(res) {
        _this.rowid = res.insertId;
      });
    } else {
      DatabaseService.updateTeam(this.values());
    }
  };

  TeamFactory.prototype.newRecord = function() {
    return this.rowid != 0;
  };

  TeamFactory.prototype.sync = function() {
    console.log("Sync the team: ", this);
    var syncFunction = null;
    if(team.remoteId){
      syncFunction = SyncService.putTeam;
    } else {
      syncFunction = SyncService.postTeam;
    }
    var that = this;
    syncFunction(that).then(function(data) {
      that.remoteId = data.id;
      that.syncPlayers(data.players);
      that.save();
      console.log("sync complete");
    }, function(reject) {
      console.log("sync failed");
    });
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

  TeamFactory.prototype.values = function() {
    return {
      // occurrence: this.occurrence,
      rowid: this.rowid,
      name: this.name,
      userId: this.userId,
      remoteId: this.remoteId
    };
  };

  TeamFactory.prototype.syncValues = function() {
    return {
      name: this.name
    };
  };

  TeamFactory.prototype.serializedValues = function() {
    return angular.toJson(this.values());
  };

  return TeamFactory;
});

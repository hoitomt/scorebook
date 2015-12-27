app.factory('TeamFactory', function($q, PlayerFactory, UserFactory, SyncService, DatabaseService) {
  var localStorageIndexKey = 'teams_keys';

  var TeamFactory = function(args) {
    // this.occurrence = args.occurrence || 1;
    this.localId = args.localId;
    this.name = args.name;
    this.userId = args.userId || UserFactory.userId() || 0;
    // this.key = args.key || this.createKey();
    this.remoteId = args.remoteId || 0;
    this.players = new Array;

    if(angular.isDefined(args.players) && args.players.length > 0) {
      for(player of args.players) {
        this.players.push(new PlayerFactory(player));
      }
    }
    this.sortedPlayers();
  };

  TeamFactory.find = function(key) {
    var rawTeam = localStorage.getItem(key);
    if(rawTeam) {
      var team = angular.fromJson(rawTeam);
      team.key = key;
      return new TeamFactory(team);
    } else {
      return null;
    }
  };

  // Every team key is stored in a separate key.
  // By "getting" this key we can retrieve only the team keys from localStorage
  // This is necessary for pulling lists of teams
  // TeamFactory.localStorageKeys = function() {
  //   var keys = localStorage.getItem(localStorageIndexKey);
  //   if(keys) {
  //     return angular.fromJson(keys);
  //   } else {
  //     var a = new Array;
  //     return a;
  //   }
  // };

  TeamFactory.teams = function(number) {
    console.log("Retrieve all teams");
    var teamArray = new Array;
    DatabaseService.selectTeams().then(function(res){
      if(res.rows.length == 0) return;
      var teamsParams = res.rows;
      for(var i = 0; i < teamsParams.length; i++) {
        team = teamsParams[i];
        teamArray.push(new TeamFactory(team));
      }
    });
    return teamArray;
  };

  TeamFactory.prototype.save = function() {
    console.log("Persist to Local Storage");
    return this.upsert();
  };

  TeamFactory.prototype.upsert = function() {
    if(this.localId){
      DatabaseService.updateTeam(this.values());
    } else {
      // DatabaseService.insertTeam(this.values()).then(function(res){
      //   _this.localId = res.insertId;
      // });
      DatabaseService.insertTeam(this.values());
    }
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
  }

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
  }

  TeamFactory.prototype.addPlayer = function(player) {
    this.players.push(player);
    this.save();
  }

  TeamFactory.prototype.removePlayer = function(playerKey) {
    // create a new array of all players except the one you want to delete
    this.players = this.players.filter(function(existingPlayer) {
      return existingPlayer.key !== playerKey
    });
    this.save();
  }

  TeamFactory.prototype.findPlayer = function(playerKey) {
    var rawPlayerArray = this.players.filter(function(existingPlayer) {
      return existingPlayer.key == playerKey;
    });
    var playerArray = angular.fromJson(rawPlayerArray);
    return new PlayerFactory(playerArray[0]);
  }

  TeamFactory.prototype.sortedPlayers = function() {
    this.players.sort(function(a, b) {
      var aNumber = a.number ? parseInt(a.number) : 0;
      var bNumber = b.number ? parseInt(b.number) : 0;
      if(aNumber > bNumber) {
        return 1;
      }
      if(bNumber > aNumber){
        return -1;
      }
      return 0;
    });
    return this.players;
  }

  // TeamFactory.prototype.createKey = function() {
  //   if(this.userId) {
  //     return this.userId + '_' + this.name + '_' + this.occurrence;
  //   } else {
  //     return this.name + '_' + this.occurrence;
  //   }
  // };

  TeamFactory.prototype.values = function() {
    return {
      // occurrence: this.occurrence,
      localId: this.localId,
      name: this.name,
      userId: this.userId,
      remoteId: this.remoteId,
      players: this.players
    };
  };

  TeamFactory.prototype.syncValues = function() {
    return {
      name: this.name,
      players: this.syncPlayerValues()
    };
  };

  TeamFactory.prototype.syncPlayerValues = function() {
    return this.players.map(function(player) {
      return player.syncValues();
    });
  };

  TeamFactory.prototype.serializedValues = function() {
    return angular.toJson(this.values());
  };

  // TeamFactory.prototype.addLocalStorageKey = function(key) {
  //   var occurrence = 1;

  //   // Check for key
  //   while(localStorage[key] != null) {
  //     // increment the occurrence in the key
  //     var keyArray = key.split('_');
  //     occurrence = parseInt(keyArray.pop()) + 1;
  //     keyArray.push(occurrence);
  //     key = keyArray.join('_');
  //   }
  //   this.occurrence = occurrence;
  //   this.key = key;

  //   var existingKeys = TeamFactory.localStorageKeys();
  //   existingKeys.push(key);
  //   localStorage.setItem(localStorageIndexKey, angular.toJson(existingKeys));
  // };

  return TeamFactory;
});

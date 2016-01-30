app.factory('PlayerFactory', function($q, DatabaseService) {

  var PlayerFactory = function(args) {
    this.rowid = args.rowid || null;
    this.remoteId = args.remoteId || args.remote_id || null;
    this.name = args.name;
    this.number = args.number;
    this.teamId = args.teamId || args.team_id;
  };

  PlayerFactory.deletePlayer = function(playerId) {
    console.log("Delete Player: ", playerId);
    var deferred = $q.defer();
    DatabaseService.deletePlayer(playerId).then(function(res) {
      deferred.resolve();
    }, function(e){
      console.log(e.message);
    });
    return deferred.promise;
  };

  PlayerFactory.find = function(playerId) {
    console.log("Retrieve Player: ", playerId);
    var deferred = $q.defer();
    DatabaseService.selectPlayer(teamId).then(function(res) {
      player = new PlayerFactory(res.rows.item(0));
      deferred.resolve(player);
    }, function(e){
      console.log(e.message);
      deferred.reject(e);
    });
    return deferred.promise;
  };

  PlayerFactory.players = function(teamId) {
    console.log("Retrieve Players for: ", teamId);
    var deferred = $q.defer();
    var players = [];
    DatabaseService.selectPlayers(teamId).then(function(res) {
      for(var i = 0; i < res.rows.length; i++) {
        var player = new PlayerFactory(res.rows.item(i));
        players.push(player);
      }
      deferred.resolve(players);
    }, function(e){
      console.log(e.message);
      deferred.reject(e);
    });
    return deferred.promise;
  };

  PlayerFactory.updateRemoteId = function(rowid, remoteId) {
    DatabaseService.updatePlayerRemoteId(rowid, remoteId);
  }

  PlayerFactory.prototype.save = function() {
    console.log("Persist to WebSQL");
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
    return !this.rowid;
  };

  PlayerFactory.prototype.syncValues = function() {
    return {
      name: this.name,
      number: this.number,
      team_id: this.teamId,
      id: this.remoteId,
      device_id: this.rowid
    };
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

  return PlayerFactory;
});

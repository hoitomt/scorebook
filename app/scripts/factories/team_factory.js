app.factory('TeamFactory', function(PlayerFactory, UserFactory) {
  var localStorageIndexKey = 'teams_keys';

  var TeamFactory = function(args) {
    this.occurrence = args.occurrence || 1;
    this.name = args.name;
    this.userId = args.userId || UserFactory.userId();
    this.key = args.key || this.createKey();
    this.remoteId = args.remoteId || 0;
    this.players = new Array;

    if(angular.isDefined(args.players) && args.players.length > 0) {
      for(player of args.players) {
        this.players.push(new PlayerFactory(player));
      }
    }
  }

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
  TeamFactory.localStorageKeys = function() {
    var keys = localStorage.getItem(localStorageIndexKey);
    if(keys) {
      return angular.fromJson(keys);
    } else {
      var a = new Array;
      return a;
    }
  };

  TeamFactory.teams = function(number) {
    number = angular.isUndefined(number) ? 1 : number
    var teamKeys = TeamFactory.localStorageKeys();
    var teamArray = new Array;
    while(teamArray.length < number && teamKeys.length > 0) {
      var team = TeamFactory.find(teamKeys.pop());
      teamArray.push(team);
    }
    return teamArray
  };

  TeamFactory.prototype.create = function() {
    console.log("Create new team");
    // Write the key to the localStorage index
    this.addLocalStorageKey(this.key);
    this.save();
  };

  TeamFactory.prototype.save = function() {
    console.log("Persist to Local Storage: ", this.key);
    localStorage.setItem(this.key, this.serializedValues());
  };

  TeamFactory.prototype.addPlayer = function(player) {
    this.players.push(player);
    this.save();
  }

  TeamFactory.prototype.removePlayer = function(player) {
    // create a new array of all players except the one you want to delete
    this.players = this.players.filter(function(existingPlayer) {
      return existingPlayer.name === null ||
             existingPlayer.name === "" ||
             existingPlayer.name !== player.name
    })
    this.save();
  }

  TeamFactory.prototype.createKey = function() {
    return this.userId + '_' + this.name + '_' + this.occurrence;
  };

  TeamFactory.prototype.values = function() {
    return {
      occurrence: this.occurrence,
      name: this.name,
      userId: this.userId,
      remoteId: this.remoteId,
      players: this.players
    };
  };

  TeamFactory.prototype.serializedValues = function() {
    return angular.toJson(this.values());
  };

  TeamFactory.prototype.addLocalStorageKey = function(key) {
    var occurrence = 1;

    // Check for key
    while(localStorage[key] != null) {
      // increment the occurrence in the key
      var keyArray = key.split('_');
      occurrence = parseInt(keyArray.pop()) + 1;
      keyArray.push(occurrence);
      key = keyArray.join('_');
    }
    this.occurrence = occurrence;
    this.key = key;

    var existingKeys = TeamFactory.localStorageKeys();
    existingKeys.push(key);
    localStorage.setItem(localStorageIndexKey, angular.toJson(existingKeys));
  };

  return TeamFactory;
});

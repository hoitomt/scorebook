app.factory('GameFactory', function(PlayerFactory) {
  var localStorageIndexKey = 'games_keys';

  var GameFactory = function(args) {
    // Use this to track multiple games with the same opponent on the same date
    this.occurrence = args.occurrence || 1;
    this.date = args.date;
    this.opponent = args.opponent;
    this.key = args.key || this.createKey();
    this.points = args.points || 0;
    this.turnovers = args.turnovers || 0;
    this.fouls = args.fouls || 0;
    this.players = new Array;

    this.inGamePlayers = new Array;
    this.benchPlayers = new Array;
    if(angular.isUndefined(args.players) || args.players.length <= 0) {
      this.players = createPlayers();
    } else {
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

  GameFactory.prototype.create = function() {
    console.log("Create new game");
    // Write the key to the localStorage index
    this.addLocalStorageKey(this.key);
    this.save();
  };

  GameFactory.prototype.save = function() {
    console.log("Persist to Local Storage: ", this.key);
    localStorage.setItem(this.key, this.serializedValues());
  };

  // Returns yyyymmdd for mm/dd/yyyy
  GameFactory.prototype.dateStamp = function() {
    if(this.date) {
      var dateArray = this.date.split('/');
      return dateArray[2] + dateArray[0] + dateArray[1];
    } else {
      return "";
    }
  };

  GameFactory.prototype.createKey = function() {
    return this.dateStamp() + '_' + this.opponent + '_' + this.occurrence;
  };

  GameFactory.prototype.values = function() {
    return {
      occurrence: this.occurrence,
      date: this.date,
      opponent: this.opponent,
      players: this.players,
      points: this.points,
      turnovers: this.turnovers,
      fouls: this.fouls
    };
  };

  GameFactory.prototype.serializedValues = function() {
    return angular.toJson(this.values());
  };

  GameFactory.prototype.addLocalStorageKey = function(key) {
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

    var existingKeys = GameFactory.localStorageKeys();
    existingKeys.push(key);
    localStorage.setItem(localStorageIndexKey, angular.toJson(existingKeys));
  };

  GameFactory.prototype.updatePlayerStatus = function() {
    this.inGamePlayers = this.players.filter(function(player) {
      return player.inGame;
    });

    this.benchPlayers = this.players.filter(function(player) {
      return !player.inGame;
    });

    this.save();
  }

  GameFactory.prototype.stats = function() {
    var points = "Points: " + this.points;
    var fouls = "Fouls: " + this.fouls;
    var turnovers = "Turnovers: " + this.turnovers;
    return points + ' ' + turnovers + ' ' + fouls;
  }

  GameFactory.prototype.resetFouls = function() {
    this.fouls = 0;
  }

  GameFactory.find = function(key) {
    var rawGame = localStorage.getItem(key);
    if(rawGame) {
      var game = angular.fromJson(rawGame);
      game.key = key;
      return new GameFactory(game);
    } else {
      return null;
    }
  };

  // Every game key is stored in a separate key.
  // By "getting" this key we can retrieve only the game keys from localStorage
  // This is necessary for pulling lists of games
  GameFactory.localStorageKeys = function() {
    var keys = localStorage.getItem(localStorageIndexKey);
    if(keys) {
      return angular.fromJson(keys);
    } else {
      var a = new Array;
      return a;
    }
  };

  GameFactory.games = function(number) {
    var gameKeys = GameFactory.localStorageKeys();
    if(!number && gameKeys){
      number = gameKeys.length;
    }
    var gameArray = new Array;
    while(gameArray.length < number && gameKeys.length > 0) {
      var game = GameFactory.find(gameKeys.pop());
      gameArray.push(game);
    }
    return gameArray
  };

  function createPlayers() {
    var players = [
      new PlayerFactory({name: 'Anna Hoitomt', number: '11', inGame: true}),
      new PlayerFactory({name: 'Adrienne Morning', number: '4', inGame: true}),
      new PlayerFactory({name: 'Emma Vinopal', number: '1', inGame: true}),
      new PlayerFactory({name: 'Caitlyn Klink', number: '32', inGame: true}),
      new PlayerFactory({name: 'Katie Andrews', number: 'x', inGame: true}),
      new PlayerFactory({name: 'Jessica Sabbagh', number: '23', inGame: false}),
      new PlayerFactory({name: 'Ariana Smith', number: '25', inGame: false}),
      new PlayerFactory({name: 'Anna Allen', number: 'y', inGame: false}),
    ]
    return players;
  };

  return GameFactory;
});

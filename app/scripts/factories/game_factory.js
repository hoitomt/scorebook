app.factory('GameFactory', function(PlayerFactory) {
  var localStorageIndexKey = 'games_keys';

  var GameFactory = function(args) {
    // Use this to track multiple games with the same opponent on the same date
    this.occurrence = args.occurrence || 1;
    this.date = args.date;
    this.opponent = args.opponent;
    this.key = this.createKey();
    this.players = createPlayers();
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
      players: this.players
    };
  };

  GameFactory.prototype.serializedValues = function() {
    return angular.toJson(this.values());
  };

  GameFactory.prototype.addLocalStorageKey = function(key) {
    var existingKeys = GameFactory.localStorageKeys();
    var occurrence = 1;

    // Check for key
    while(GameFactory.find(key) != null) {
      // increment the occurrence in the key
      var keyArray = key.split('_');
      occurrence = parseInt(keyArray.pop()) + 1;
      keyArray.push(occurrence);
      key = keyArray.join('_');
    }
    this.occurrence = occurrence;
    this.key = key;

    existingKeys.push(key);
    localStorage.setItem(localStorageIndexKey, angular.toJson(existingKeys));
  };

  GameFactory.find = function(key) {
    var rawGame = localStorage.getItem(key);
    if(rawGame) {
      var game = angular.fromJson(rawGame);
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
    number = angular.isUndefined(number) ? 1 : number
    var gameKeys = GameFactory.localStorageKeys();
    var gameArray = new Array;
    while(gameArray.length < number && gameKeys.length > 0) {
      var game = GameFactory.find(gameKeys.pop());
      gameArray.push(game);
    }
    return gameArray
  };

  function createPlayers() {
    var players = [
      new PlayerFactory({name: 'Anna Hoitomt', number: '11'}),
      new PlayerFactory({name: 'Adrienne Morning', number: '4'})
    ]
    return players;
  };

  return GameFactory;
});

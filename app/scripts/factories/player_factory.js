app.factory('PlayerFactory', function() {

  var PlayerFactory = function(args) {
    this.name = args.name;
    this.number = args.number;
    this.onePointAttempts = args.onePointAttempts || 0;
    this.onePointBaskets = args.onePointBaskets || 0;
    this.twoPointAttempts = args.twoPointAttempts || 0;
    this.twoPointBaskets = args.twoPointBaskets || 0;
    this.threePointAttempts = args.threePointAttempts || 0;
    this.threePointBaskets = args.threePointBaskets || 0;
    this.turnovers = args.turnovers || 0;
    this.rebounds = args.rebounds || 0;
    this.assists = args.assists || 0;
    this.fouls = args.fouls || 0;
    this.inGame = args.inGame || false;
  };

  PlayerFactory.prototype.values = function() {
    return {
      name: this.name,
      number: this.number,
      onePointAttempts: this.onePointAttempts,
      onePointBaskets: this.onePointBaskets,
      twoPointAttempts: this.twoPointAttempts,
      twoPointBaskets: this.twoPointBaskets,
      threePointAttempts: this.threePointAttempts,
      threePointBaskets: this.threePointBaskets,
      turnovers: this.turnovers,
      rebounds: this.rebounds,
      assists: this.assists,
      fouls: this.fouls,
      inGame: this.inGame
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

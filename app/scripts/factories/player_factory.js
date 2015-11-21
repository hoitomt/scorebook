app.factory('PlayerFactory', function() {

  var PlayerFactory = function(args) {
    this.name = args.name;
    this.number = args.number;
    this.freeThrowAttempts = args.freeThrowAttempts || 0;
    this.freeThrows = args.freeThrows || 0;
    this.twoPointAttempts = args.twoPointAttempts || 0;
    this.twoPointBaskets = args.twoPointBaskets || 0;
    this.threePointAttempts = args.threePointAttempts || 0;
    this.threePointBaskets = args.threePointBaskets || 0;
    this.turnovers = args.turnovers || 0;
    this.rebounds = args.rebounds || 0;
    this.assists = args.assists || 0;
    this.fouls = args.fouls || 0;
  };

  PlayerFactory.prototype.values = function() {
    return {
      name: this.name,
      number: this.number,
      freeThrowAttempts: this.freeThrowAttempts,
      freeThrows: this.freeThrows,
      twoPointAttempts: this.twoPointAttempts,
      twoPointBaskets: this.twoPointBaskets,
      threePointAttempts: this.threePointAttempts,
      threePointBaskets: this.threePointBaskets,
      turnovers: this.turnovers,
      rebounds: this.rebounds,
      assists: this.assists,
      fouls: this.fouls
    };
  };

  PlayerFactory.prototype.serializedValues = function() {
    return angular.toJson(this.values());
  };

  return PlayerFactory;
});

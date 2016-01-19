app.controller('boxScoresController', function($scope, $state, $stateParams, $location, GameFactory, PlayerFactory, BoxScoreFactory) {
  console.log("Box Score Controller");
  var gameId = $stateParams.gameId;
  $scope.inGamePlayerBoxScores = new Array;
  $scope.benchPlayerBoxScores = new Array;
  $scope.boxScores = new Array;

  GameFactory.find(gameId).then(function(game){
    $scope.game = game;
    var playerPromise = PlayerFactory.players(game.teamId);
    var boxScorePromise = BoxScoreFactory.boxScores(gameId)

    Promise.all([playerPromise, boxScorePromise]).then(function(values){
      var players = values[0];
      var boxScores = values[1];

      var playerHash = {};
      for(player of players) {
        playerHash[player.rowid] = player;
      }

      var boxScoresWithPlayers = [];
      for(boxScore of boxScores) {
        boxScore.playerName = playerHash[boxScore.playerId].name;
        boxScore.playerNumber = playerHash[boxScore.playerId].number;
        boxScoresWithPlayers.push(boxScore);
      }

      $scope.boxScores = boxScoresWithPlayers;
      refreshPlayerStatus();
      $scope.$apply()
    })
  });

  function refreshPlayerStatus() {
    $scope.inGamePlayerBoxScores = $scope.boxScores.filter(function(boxScore){
      return boxScore.getInGame();
    });

    $scope.benchPlayerBoxScores = $scope.boxScores.filter(function(boxScore){
      return !boxScore.getInGame();
    });
  }

  $scope.moveToBench = function(game, boxScore) {
    boxScore.inGame = false;
    game.setNeedsSync(true);
    boxScore.save();
    refreshPlayerStatus();
  };

  $scope.putInGame = function(game, boxScore) {
    boxScore.inGame = true;
    game.setNeedsSync(true);
    boxScore.save();
    refreshPlayerStatus();
  }

  $scope.addScore = function(game, boxScore, amount) {
    boxScore.addScore(amount);
    game.points += amount;
    game.setNeedsSync(true);
    boxScore.save();
  };

  $scope.addShotAttempt = function(game, boxScore, amount) {
    boxScore.addShotAttempt(amount)
    game.setNeedsSync(true);
    boxScore.save();
  };

  $scope.addRebound = function(game, boxScore) {
    boxScore.addRebound()
    game.setNeedsSync(true);
    boxScore.save();
  }

  $scope.addAssist = function(game, boxScore) {
    boxScore.addAssist()
    game.setNeedsSync(true);
    boxScore.save();
  }

  $scope.addTurnover = function(game, boxScore) {
    boxScore.addTurnover();
    game.turnovers += 1;
    game.setNeedsSync(true);
    boxScore.save();
  }

  $scope.addFoul = function(game, boxScore) {
    boxScore.addFoul();
    game.fouls += 1;
    game.setNeedsSync(true);
    boxScore.save();
  }

  // Corrections
  $scope.removeScore = function(game, boxScore, amount) {
    boxScore.removeScore(amount);
    game.points = game.points > amount ? game.points - amount : 0;
    game.setNeedsSync(true);
    boxScore.save();
  };

  $scope.removeShotAttempt = function(game, boxScore, amount) {
    boxScore.removeShotAttempt(amount)
    game.setNeedsSync(true);
    boxScore.save();
  };

  $scope.removeRebound = function(game, boxScore) {
    boxScore.removeRebound()
    game.setNeedsSync(true);
    boxScore.save();
  }

  $scope.removeAssist = function(game, boxScore) {
    boxScore.removeAssist()
    game.setNeedsSync(true);
    boxScore.save();
  }

  $scope.removeTurnover = function(game, boxScore) {
    boxScore.removeTurnover();
    game.turnovers  = game.turnovers > 0 ? game.turnovers - 1 : 0;
    game.setNeedsSync(true);
    boxScore.save();
  }

  $scope.removeFoul = function(game, boxScore) {
    boxScore.removeFoul();
    game.fouls = game.fouls > 0 ? game.fouls - 1 : 0
    game.setNeedsSync(true);
    boxScore.save();
  }

  $scope.clearFouls = function(game) {
    game.fouls = 0;
    game.setNeedsSync(true);
  }


});

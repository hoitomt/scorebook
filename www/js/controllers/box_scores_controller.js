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
    })
  });

  function refreshPlayerStatus() {
    $scope.inGamePlayerBoxScores = $scope.boxScores.filter(function(boxScore){
      return boxScore.inGame;
    });

    $scope.benchPlayerBoxScores = $scope.boxScores.filter(function(boxScore){
      return !boxScore.inGame;
    });
    $scope.$apply()
  }

  $scope.moveToBench = function(game, boxScore) {
    boxScore.inGame = false; refreshPlayerStatus();
  };

  $scope.putInGame = function(game, boxScore) {
    boxScore.inGame = true; refreshPlayerStatus();
  }

  $scope.addScore = function(game, boxScore, amount) {
    boxScore.addScore(amount);
    game.points += amount;
    boxScore.save();
  };

  $scope.addShotAttempt = function(game, boxScore, amount) {
    boxScore.addShotAttempt(amount); boxScore.save();
  };

  $scope.addRebound = function(game, boxScore) {
    boxScore.addRebound(); boxScore.save();
  }

  $scope.addAssist = function(game, boxScore) {
    boxScore.addAssist(); boxScore.save();
  }

  $scope.addTurnover = function(game, boxScore) {
    boxScore.addTurnover();
    game.turnovers += 1;
    boxScore.save();
  }

  $scope.addFoul = function(game, boxScore) {
    boxScore.addFoul();
    game.fouls += 1;
    boxScore.save();
  }

  // Corrections
  $scope.removeScore = function(game, boxScore, amount) {
    boxScore.removeScore(amount);
    game.points = game.points > amount ? game.points - amount : 0;
    boxScore.save();
  };

  $scope.removeShotAttempt = function(game, boxScore, amount) {
    boxScore.removeShotAttempt(amount); boxScore.save();
  };

  $scope.removeRebound = function(game, boxScore) {
    boxScore.removeRebound(); boxScore.save();
  }

  $scope.removeAssist = function(game, boxScore) {
    boxScore.removeAssist(); boxScore.save();
  }

  $scope.removeTurnover = function(game, boxScore) {
    boxScore.removeTurnover();
    game.turnovers  = game.fouls > 0 ? game.fouls - 1 : 0;
    boxScore.save();
  }

  $scope.removeFoul = function(game, boxScore) {
    boxScore.removeFoul();
    game.fouls = game.fouls > 0 ? game.fouls - 1 : 0
    boxScore.save();
  }

  $scope.clearFouls = function(game) {
    game.fouls = 0;
    boxScore.save();
  }


});

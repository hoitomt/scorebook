app.controller('gamesController', function($scope, $stateParams, $location, GameFactory, TeamFactory) {

  $scope.showCorrectionPanel = false;
  // Default the select list to "Select Team"
  $scope.game = {};
  $scope.game.teamKey = "0";
  $scope.teams = TeamFactory.teams();

  if($stateParams.gameId) {
    var gameKey = $stateParams.gameId
    console.log("Game ID: " + gameKey);
    $scope.game = GameFactory.find(gameKey);
  };

  $scope.createNewGame = function(gameParams) {
    console.log("Game Parameters: ", gameParams);
    if(angular.isUndefined(gameParams.opponent) || angular.isUndefined(gameParams.date)) {
      console.log("Invalid Game Create");
    } else {
      var team = TeamFactory.find(gameParams.teamKey);
      gameParams.players = team.players;
      var game = new GameFactory(gameParams);
      game.create();

      $location.path('/games/' + game.key);
    }
  };

  $scope.cancelCreateGame = function() {
    resetOpponent();
    $location.path('/');
  };

  function resetOpponent() {
    $scope.game = {opponent: "", date: ""};
  };

  $scope.moveToBench = function(game, player) {
    player.inGame = false; game.updatePlayerStatus();
  };

  $scope.putInGame = function(game, player) {
    player.inGame = true; game.updatePlayerStatus();
  }

  $scope.addScore = function(game, player, amount) {
    player.addScore(amount); game.save();
  };

  $scope.addRebound = function(game, player) {
    player.addRebound(); game.save();
  }

  $scope.addAssist = function(game, player) {
    player.addAssist(); game.save();
  }

  $scope.addTurnover = function(game, player) {
    player.addTurnover(); game.save();
  }

  $scope.addFoul = function(game, player) {
    player.addFoul(); game.save();
  }

  // Corrections
  $scope.removeScore = function(game, player, amount) {
    player.removeScore(amount); game.save();
  };

  $scope.removeRebound = function(game, player) {
    player.removeRebound(); game.save();
  }

  $scope.removeAssist = function(game, player) {
    player.removeAssist(); game.save();
  }

  $scope.removeTurnover = function(game, player) {
    player.removeTurnover(); game.save();
  }

  $scope.removeFoul = function(game, player) {
    player.removeFoul(); game.save();
  }

});

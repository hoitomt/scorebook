app.controller('gameController', function($scope, $route, $routeParams, $location, GameFactory, PlayerFactory) {

  $scope.showCorrectionPanel = false;

  if($route.current.routeName == 'game' && $routeParams.id) {
    var gameKey = $routeParams.id
    console.log("Game ID: " + gameKey);
    $scope.game = GameFactory.find(gameKey);
  };

  $scope.moveToBench = function(player) {

  };

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

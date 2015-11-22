app.controller('gameController', function($scope, $route, $routeParams, $location, GameFactory, PlayerFactory) {
  if($route.current.routeName == 'game' && $routeParams.id) {
    var gameKey = $routeParams.id
    console.log("Game ID: " + gameKey);
    $scope.game = GameFactory.find(gameKey);
  };

  $scope.addScore = function(game, player, amount) {
    console.log("Add Score Player: ", player, " Amount: ", amount);
    player.addScore(amount);
    game.save();
  };

  $scope.addRebound = function(game, player) {
    console.log("Add Rebound Player: ", player);
    player.addRebound();
    game.save();
  }

  $scope.addAssist = function(game, player) {
    console.log("Add Assist Player: ", player);
    player.addAssist();
    game.save();
  }

  $scope.addTurnover = function(game, player) {
    console.log("Add Turnover Player: ", player);
    player.addTurnover();
    game.save();
  }

  $scope.addFoul = function(game, player) {
    console.log("Add Foul Player: ", player);
    player.addFoul();
    game.save();
  }

});

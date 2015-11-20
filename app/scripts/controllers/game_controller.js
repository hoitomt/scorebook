app.controller('gameController', function($scope, $route, $routeParams, $location, GameFactory) {
  if($route.current.routeName == 'game' && $routeParams.id) {
    console.log("Game ID: " + $routeParams.id);
  }

  $scope.message = "Welcome to the Arena";
  $scope.showNewGameForm = false;

  resetOpponent();

  $scope.createNewGame = function(game) {
    console.log("Opponent: ", game);
    var gameFactory = new GameFactory(game);
    gameFactory.save();

    opponentId = '3';
    $location.path('/game/' + opponentId);
  }

  $scope.cancelCreateGame = function() {
    resetOpponent();
    $scope.showNewGameForm = false;
  }

  function resetOpponent() {
    $scope.opponent = {name: ""};
  }
});

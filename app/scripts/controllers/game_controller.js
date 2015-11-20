app.controller('gameController', function($scope, $route, $routeParams, $location, GameFactory) {
  if($route.current.routeName == 'game' && $routeParams.id) {
    console.log("Game ID: " + $routeParams.id);
  }

  $scope.message = "Welcome to the Arena";
  $scope.showNewGameForm = false;

  resetOpponent();

  $scope.createNewGame = function(gameParams) {
    console.log("Opponent: ", gameParams);
    var game = new GameFactory(gameParams);
    game.create();

    $location.path('/game/' + game.key);
  }

  $scope.cancelCreateGame = function() {
    resetOpponent();
    $scope.showNewGameForm = false;
  }

  function resetOpponent() {
    $scope.opponent = {name: ""};
  }
});

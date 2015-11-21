app.controller('gameController', function($scope, $route, $routeParams, $location, GameFactory, PlayerFactory) {
  if($route.current.routeName == 'game' && $routeParams.id) {
    var gameKey = $routeParams.id
    console.log("Game ID: " + gameKey);
    $scope.game = GameFactory.find(gameKey);
  }

  $scope.showNewGameForm = false;
  $scope.staticGames = GameFactory.games(5);

  $scope.createNewGame = function(gameParams) {
    console.log("Opponent: ", gameParams);
    if(angular.isUndefined(gameParams.opponent) || angular.isUndefined(gameParams.date)) {
      console.log("Invalid Game Create");
    } else {
      var game = new GameFactory(gameParams);
      game.create();

      $location.path('/game/' + game.key);
    }
  }

  $scope.cancelCreateGame = function() {
    resetOpponent();
    $scope.showNewGameForm = false;
  }

  function resetOpponent() {
    $scope.game = {opponent: "", date: ""};
  }
});

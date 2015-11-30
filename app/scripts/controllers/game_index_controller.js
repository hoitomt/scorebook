app.controller('gameIndexController', function($scope, $location, GameFactory, PlayerFactory) {
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
  };

  $scope.cancelCreateGame = function() {
    resetOpponent();
    $scope.showNewGameForm = false;
  };

  function resetOpponent() {
    $scope.game = {opponent: "", date: ""};
  };

});

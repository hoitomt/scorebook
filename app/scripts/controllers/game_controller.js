app.controller('gameController', ['$scope', function($scope) {
  $scope.message = "Welcome to the Arena";
  $scope.showNewGameForm = false;

  resetOpponent();

  $scope.createNewGame = function(opponent) {
    console.log("Opponent: ", opponent);
  }

  $scope.cancelCreateGame = function() {
    resetOpponent();
    $scope.showNewGameForm = false;
  }

  function resetOpponent() {
    $scope.opponent = {name: ""};
  }
}]);

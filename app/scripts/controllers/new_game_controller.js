app.controller('NewGameController', ['$scope', function($scope) {
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

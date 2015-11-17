var app = angular.module('scorebook', []);

// Runs before anything else in the app
app.run(function($rootScope) {
  console.log("I hear jingle bells...");
  $rootScope.name = 'Santa Clause';
})

app.controller('MyController', function($scope) {
  $scope.person = {
    name: 'Mrs. Claus'
  };
});

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

app.controller('gameIndexController', function($scope, $location, GameFactory, TeamFactory) {
  $scope.staticGames = GameFactory.games();
  $scope.teams = TeamFactory.teams();
});

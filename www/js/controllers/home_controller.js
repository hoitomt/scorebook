app.controller('homeController', function($scope, $state, $cookies, $location, GameFactory, TeamFactory) {
  $scope.refreshItems = function() {
    $scope.games = GameFactory.games();
    $scope.teams = TeamFactory.teams();
  }

  $scope.refreshItems();
  $scope.isNewUser = $scope.teams.length <= 0;

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    console.log("State changed: ", toState);
    if ($location.path() == "/") {
      $scope.refreshItems();
    }
  });

  var connected = $cookies.get('connected');
  if(connected && connected == 'true') {
    $scope.connectedClass = 'connected';
  } else {
    $scope.connectedClass = 'not-connected';
  }
});

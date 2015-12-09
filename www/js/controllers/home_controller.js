app.controller('homeController', function($scope, $cookies, $location, GameFactory, TeamFactory) {

  $scope.refreshItems = function() {
    $scope.games = GameFactory.games();
    $scope.teams = TeamFactory.teams();
  }

  $scope.refreshItems();

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

app.controller('homeController', function($scope, $state, $cookies, $location, GameFactory, TeamFactory) {

  // if($scope.newUser()) {
  //   $state.go('tab.teams');
  // }

  $scope.refreshItems = function() {
    $scope.games = GameFactory.games();
    $scope.teams = TeamFactory.teams();
  }

  $scope.newUser = function() {
    return TeamFactory.teams().length <= 0;
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

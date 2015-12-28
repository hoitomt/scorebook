app.controller('homeController', function($scope, $state, $cookies, $location, GameFactory, TeamFactory) {
  function refreshItems() {
    // GameFactory.games().then(function(games){
    //   $scope.games = games
    // });
    TeamFactory.teams().then(function(teams){
      $scope.teams = teams;
      $scope.isNewUser = teams.length <= 0;
    });
  }

  $scope.games = GameFactory.games();
  refreshItems();

  // $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
  //   console.log("State changed: ", toState);
  //   if ($location.path() == "/") {
  //     $scope.refreshItems();
  //   }
  // });

  var connected = $cookies.get('connected');
  if(connected && connected == 'true') {
    $scope.connectedClass = 'connected';
  } else {
    $scope.connectedClass = 'not-connected';
  }
});

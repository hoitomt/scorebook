app.controller('homeController', function($scope, $state, $cookies, $location, GameFactory, TeamFactory, SyncService) {
  $scope.isReady = false;

  function refreshItems() {
    TeamFactory.teams().then(function(teams){
      $scope.teams = teams;
      $scope.isNewUser = teams.length <= 0;
    }).finally(function(){
      $scope.isReady = true;
    });
    GameFactory.games().then(function(games){
      $scope.games = games;
    })
  }

  refreshItems();

  var connected = $cookies.get('connected');
  if(connected && connected == 'true') {
    $scope.connectedClass = 'connected';
  } else {
    $scope.connectedClass = 'not-connected';
  }


  $scope.syncData = function() {
    SyncService.sync();
  }
});


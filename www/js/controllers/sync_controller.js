app.controller('syncController', function($scope, $cookies, $location, NetworkSnifferService, TeamFactory, DatabaseService) {
  console.log("Load - Check Status");
  $scope.isConnected = NetworkSnifferService.isConnected();
  $scope.isSyncing = false;
  $scope.syncMessage = "Syncing"

  $scope.syncData = function() {
    var teams = TeamFactory.teams();
    $scope.isSyncing = true;
    for(team of teams){
      console.log("Team: ", team);
      $scope.syncMessage = "Syncing Team:" + team.name
      team.sync();
    }
    $scope.isSyncing = false;
  }

  $scope.runDatabase = function() {
    console.log("Run Database");
    DatabaseService.runMigrations();
  }
});

app.controller('syncController', function($scope, $cookies, $location, NetworkSnifferService, TeamFactory, DatabaseService) {
  console.log("Load - Check Status");
  $scope.isConnected = NetworkSnifferService.isConnected();
  $scope.isSyncing = false;
  $scope.syncMessage = "Syncing";

  $scope.runDatabase = function() {
    console.log("Run Database");
    DatabaseService.runMigrations();
  }
});

// Logic
// Select all teams where needs_sync = true and remote id is null
//   POST teams with players to API

// Select all teams where needs_sync = true and remote id is NOT null
//   PUT teams with players to API

// Select all games where needs_sync = true and remote id is null
//   POST games with box scores to API

// Select all games where needs_sync = true and remote id is NOT null
//   PUT games with box scores to API

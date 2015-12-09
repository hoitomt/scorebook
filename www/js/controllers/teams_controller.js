app.controller('teamsController', function($scope, $state, $stateParams, $location, TeamFactory, PlayerFactory) {
  // Use for button display
  $scope.updatePlayerState = false;
  $scope.teams = TeamFactory.teams();

  if($stateParams.teamId) {
    var teamKey = $stateParams.teamId
    console.log("Team ID: " + teamKey);
    $scope.team = TeamFactory.find(teamKey);
  }

  $scope.createTeam = function(teamParams) {
    console.log("Team: ", teamParams);
    if(angular.isUndefined(teamParams.name)) {
      console.log("Invalid Team Create");
    } else {
      var team = new TeamFactory(teamParams);
      team.create();
      $state.go('tab.teamDetail', {teamId: team.key});
    }
  };

  $scope.createPlayer = function(team, playerParams) {
    console.log("Add Player to Team: ", team, "Player: ", playerParams);
    if(playerParams.key) {
      var existingPlayer = team.findPlayer(playerParams.key);
      if(existingPlayer) {
        console.log("Update");
        this.deletePlayer(team, {key: existingPlayer.key});
      }
      $scope.updatePlayerState = false;
    }
    var player = new PlayerFactory(playerParams)
    team.addPlayer(player);
    $scope.player = null;
  }

  $scope.deletePlayer = function(team, playerParams) {
    console.log("Remove Player from Team: ", team, "Player: ", playerParams);
    team.removePlayer(playerParams.key)
  }

  $scope.updatePlayer = function(team, playerParams) {
    console.log("Update Player from Team: ", team, "Player: ", playerParams);
    var player = new PlayerFactory(playerParams);
    $scope.player = player;
    $scope.updatePlayerState = true;
  }

  $scope.cancelCreateTeam = function() {
    resetTeam();
    $state.go('tab.teams')
  };

  function resetTeam() {
    $scope.team = {name: ""};
  };

});

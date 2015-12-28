app.controller('teamsController', function($scope, $state, $stateParams, $location, TeamFactory, PlayerFactory) {
  // Use for button display
  TeamFactory.teams().then(function(teams){
    $scope.teams = teams;
  });

  resetNewPlayerForm();

  var teamId = $stateParams.teamId;
  if(teamId){
    TeamFactory.find(teamId).then(function(team){
      $scope.team = team;
      refreshPlayers(team.rowid);
    });
  }

  $scope.navigateToTeams = function() {
    $state.go('tab.teams');
  }

  $scope.createTeam = function(valid, teamParams) {
    console.log("Team: ", valid);
    if(!valid) {
      console.log("Invalid Team Create");
      $scope.showErrors = true;
    } else {
      var team = new TeamFactory(teamParams);
      team.save();
      $state.go('tab.teamDetail', {team: team});
    }
  };

  $scope.createPlayer = function(valid, team, playerParams) {
    console.log("Player: ", valid);
    if(!valid) {
      console.log("Invalid Player Create");
      $scope.showErrors = true;
    } else {
      console.log("Add Player to Player: ", team, "Player: ", playerParams);
      playerParams.teamId = team.rowid;
      var player = new PlayerFactory(playerParams);
      player.save().then(function(player){
        resetNewPlayerForm();
        refreshPlayers(team.rowid);
      });
    }
  };

  $scope.deletePlayer = function(playerParams) {
    console.log("Remove Player from Team: ", team, "Player: ", playerParams);
    PlayerFactory.deletePlayer(playerParams.rowid).then(function(){
      refreshPlayers(playerParams.teamId);
    });
  };

  $scope.updatePlayer = function(team, playerParams) {
    console.log("Update Player from Team: ", team, "Player: ", playerParams);
    var player = new PlayerFactory(playerParams);
    $scope.player = player;
    $scope.updatePlayerState = true;
  };

  $scope.cancelCreateTeam = function() {
    resetTeam();
    $state.go('tab.teams')
  };

  function refreshPlayers(teamId) {
    PlayerFactory.players(teamId).then(function(players) {
      $scope.players = players;
    });
  };

  function resetTeam() {
    $scope.team = {name: ""};
  };

  function resetNewPlayerForm() {
    console.log("Reset the form");
    $scope.updatePlayerState = false;
    $scope.showErrors = false;
    $scope.player = {name: null, number: null};
    if(angular.isDefined($scope.teamRoster)){
      $scope.teamRoster.$setPristine();
      $scope.teamRoster.$setUntouched();
    }
  };


});

app.controller('playersController', function($scope, $rootScope, $state, $stateParams, $location, TeamFactory, PlayerFactory) {
  resetNewPlayerForm();

  var teamId = $stateParams.teamId;
  if(teamId){
    TeamFactory.find(teamId).then(function(team){
      $scope.team = team;
      refreshPlayers(team.rowid);
    })
  }

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
        team.setNeedsSync(true);
        resetNewPlayerForm();
        refreshPlayers(team.rowid);
      });
    }
  };

  $scope.deletePlayer = function(team, playerParams) {
    console.log("Player: ", playerParams);
    PlayerFactory.deletePlayer(playerParams.rowid).then(function(){
      team.setNeedsSync(true);
      refreshPlayers(playerParams.teamId);
    });
  };

  $scope.updatePlayer = function(team, playerParams) {
    console.log("Update Player from Team: ", team, "Player: ", playerParams);
    var player = new PlayerFactory(playerParams);
    $scope.player = player;
    $scope.updatePlayerState = true;
  };

  function refreshPlayers(teamId) {
    PlayerFactory.players(teamId).then(function(players) {
      $scope.players = players;
    }).finally(function(){
      $rootScope.isReady = true;
    });
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

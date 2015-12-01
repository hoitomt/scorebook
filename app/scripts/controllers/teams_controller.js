app.controller('teamsController', function($scope, $route, $routeParams, $location, TeamFactory, PlayerFactory) {
  $scope.teams = TeamFactory.teams(5);

  if($routeParams.id) {
    var teamKey = $routeParams.id
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
      $location.path('/teams/' + team.key);
    }
  };

  $scope.addPlayer = function(team, playerParams) {
    console.log("Add Player to Team: ", team, "Player: ", playerParams);
    var player = new PlayerFactory(playerParams)
    team.addPlayer(player)
  }

  $scope.removePlayer = function(team, playerParams) {
    console.log("Remove Player from Team: ", team, "Player: ", playerParams);
    var player = new PlayerFactory(playerParams)
    team.removePlayer(player)
  }

  $scope.editPlayer = function(team, playerParams) {
    console.log("Edit Player: ", team, "Player: ", playerParams);
    var player = PlayerFactory.find()
  }

  $scope.cancelCreateGame = function() {
    resetOpponent();
    $scope.showNewGameForm = false;
  };

  function resetOpponent() {
    $scope.game = {opponent: "", date: ""};
  };

});

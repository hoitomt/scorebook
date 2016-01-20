app.controller('teamsController', function($scope, $state, $stateParams, $location, TeamFactory, PlayerFactory) {
  $scope.isReady = false;

  TeamFactory.teams().then(function(teams){
    $scope.teams = teams;
  }).finally(function(){
    $scope.isReady = true;
  });

  $scope.createTeam = function(valid, teamParams) {
    console.log("Team: ", valid);
    if(!valid) {
      console.log("Invalid Team Create");
      $scope.showErrors = true;
    } else {
      var team = new TeamFactory(teamParams);
      team.save().then(function(team) {
        $state.go('tab.teamDetail', {teamId: team.rowid});
      }, function(e) {
        console.log("Invalid Team Create", e);
      });
    }
  };

  $scope.cancelCreateTeam = function() {
    resetTeam();
    $state.go('tab.teams')
  };

  function resetTeam() {
    $scope.team = {name: ""};
  };

});

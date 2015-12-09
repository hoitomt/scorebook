app.controller('gamesController', function($scope, $state, $stateParams, $location, GameFactory, TeamFactory) {

  $scope.showCorrectionPanel = false;
  // Default the select list to "Select Team"
  $scope.game = {};
  $scope.game.teamKey = "0";
  $scope.teams = TeamFactory.teams();

  if($stateParams.gameId) {
    var gameKey = $stateParams.gameId
    console.log("Game ID: " + gameKey);
    $scope.game = GameFactory.find(gameKey);
  };

  $scope.createNewGame = function(gameParams) {
    console.log("Game Parameters: ", gameParams);
    if(angular.isUndefined(gameParams.opponent) || angular.isUndefined(gameParams.date)) {
      console.log("Invalid Game Create");
    } else {
      var team = TeamFactory.find(gameParams.teamKey);
      if(team) {
        gameParams.players = team.players;
        var game = new GameFactory(gameParams);
        game.create();
        $state.go('tab.gameDetail', {gameId: game.key});
      }
    }
  };

  $scope.cancelCreateGame = function() {
    resetOpponent();
    $state.go('tab.home');
  };

  function resetOpponent() {
    $scope.game = {opponent: "", date: ""};
  };

  $scope.moveToBench = function(game, player) {
    player.inGame = false; game.updatePlayerStatus();
  };

  $scope.putInGame = function(game, player) {
    player.inGame = true; game.updatePlayerStatus();
  }

  $scope.addScore = function(game, player, amount) {
    player.addScore(amount); game.save();
  };

  $scope.addRebound = function(game, player) {
    player.addRebound(); game.save();
  }

  $scope.addAssist = function(game, player) {
    player.addAssist(); game.save();
  }

  $scope.addTurnover = function(game, player) {
    player.addTurnover(); game.save();
  }

  $scope.addFoul = function(game, player) {
    player.addFoul(); game.save();
  }

  // Corrections
  $scope.removeScore = function(game, player, amount) {
    player.removeScore(amount); game.save();
  };

  $scope.removeRebound = function(game, player) {
    player.removeRebound(); game.save();
  }

  $scope.removeAssist = function(game, player) {
    player.removeAssist(); game.save();
  }

  $scope.removeTurnover = function(game, player) {
    player.removeTurnover(); game.save();
  }

  $scope.removeFoul = function(game, player) {
    player.removeFoul(); game.save();
  }

  function datePickerCallback(selectedDate) {
    if(selectedDate)
      $scope.game.date = selectedDate.getMonth() + 1 + "/" +
                         selectedDate.getDate() + "/" +
                         selectedDate.getFullYear();
  }

  $scope.game.datePickerObject = {
    titleLabel: 'Game Date',  //Optional
    todayLabel: 'Today',  //Optional
    closeLabel: 'Close',  //Optional
    setLabel: 'Set',  //Optional
    setButtonType : 'button-assertive',  //Optional
    todayButtonType : 'button-assertive',  //Optional
    closeButtonType : 'button-assertive',  //Optional
    inputDate: new Date(),  //Optional
    mondayFirst: false,  //Optional
    // disabledDates: disabledDates, //Optional
    // weekDaysList: weekDaysList, //Optional
    // monthList: monthList, //Optional
    templateType: 'modal', //Optional
    showTodayButton: 'true', //Optional
    modalHeaderColor: 'bar-positive', //Optional
    modalFooterColor: 'bar-positive', //Optional
    from: new Date(2012, 8, 2), //Optional
    to: new Date(2018, 8, 25),  //Optional
    callback: function (val) {  //Mandatory
      datePickerCallback(val);
    },
    dateFormat: 'MM/dd/yyyy', //Optional
    closeOnSelect: false, //Optional
  };

});

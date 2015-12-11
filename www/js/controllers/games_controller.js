app.controller('gamesController', function($scope, $state, $stateParams, $ionicHistory, $location, GameFactory, TeamFactory) {

  $scope.showCorrectionPanel = false;

  // Default the select list to "Select Team"
  $scope.game = {};
  $scope.game.teamKey = null;

  $scope.teams = TeamFactory.teams();
  $scope.hideBackButton = false;

  if($stateParams.gameId) {
    var gameKey = $stateParams.gameId
    console.log("Game ID: " + gameKey);
    $scope.game = GameFactory.find(gameKey);
  };

  $scope.createGame = function(valid, gameParams) {
    console.log("Game Parameters: ", gameParams);
    if(angular.isUndefined($scope.game.date) || $scope.game.date == "") {
      $scope.showDatePickerErrors = true;
      valid = false;
    }
    if(!valid) {
      console.log("Invalid Game Create");
      $scope.showErrors = true;
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
    $scope.game = {opponent: "", date: "", teamKey: null};
  };

  $scope.moveToBench = function(game, player) {
    player.inGame = false; game.updatePlayerStatus();
  };

  $scope.putInGame = function(game, player) {
    player.inGame = true; game.updatePlayerStatus();
  }

  $scope.addScore = function(game, player, amount) {
    player.addScore(amount);
    game.points += amount;
    game.save();
  };

  $scope.addShotAttempt = function(game, player, amount) {
    player.addShotAttempt(amount); game.save();
  };

  $scope.addRebound = function(game, player) {
    player.addRebound(); game.save();
  }

  $scope.addAssist = function(game, player) {
    player.addAssist(); game.save();
  }

  $scope.addTurnover = function(game, player) {
    player.addTurnover();
    game.turnovers += 1;
    game.save();
  }

  $scope.addFoul = function(game, player) {
    player.addFoul();
    game.fouls += 1;
    game.save();
  }

  // Corrections
  $scope.removeScore = function(game, player, amount) {
    player.removeScore(amount);
    game.points = game.points > amount ? game.points - amount : 0;
    game.save();
  };

  $scope.removeShotAttempt = function(game, player, amount) {
    player.removeShotAttempt(amount); game.save();
  };

  $scope.removeRebound = function(game, player) {
    player.removeRebound(); game.save();
  }

  $scope.removeAssist = function(game, player) {
    player.removeAssist(); game.save();
  }

  $scope.removeTurnover = function(game, player) {
    player.removeTurnover();
    game.turnovers  = game.fouls > 0 ? game.fouls - 1 : 0;
    game.save();
  }

  $scope.removeFoul = function(game, player) {
    player.removeFoul();
    game.fouls = game.fouls > 0 ? game.fouls - 1 : 0
    game.save();
  }

  $scope.clearFouls = function(game) {
    game.fouls = 0;
    game.save();
  }

  function datePickerCallback(selectedDate) {
    if(selectedDate)
      $scope.game.date = selectedDate.getMonth() + 1 + "/" +
                         selectedDate.getDate() + "/" +
                         selectedDate.getFullYear();
    $scope.showDatePickerErrors = false;
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
    closeOnSelect: true, //Optional
  };

});

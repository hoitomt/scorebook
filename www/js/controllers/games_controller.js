app.controller('gamesController', function($scope, $state, $stateParams, $ionicHistory, $location, GameFactory, TeamFactory) {
  $scope.isReady = false;

  $scope.showCorrectionPanel = false;

  // Default the select list to "Select Team"
  $scope.game = {"teamId": null};
  $scope.game.rowid = null;

  TeamFactory.teams().then(function(teams){
    $scope.teams = teams;
  }).finally(function(){
    $scope.isReady = true;
  });;

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
      var game = new GameFactory(gameParams);
      // game.teamId = gameParams.teamId;
      game.save();
      game.createBoxScores().then(function(){
        $state.go('tab.gameBoxScore', {gameId: game.rowid});
      });
    }
  };

  $scope.cancelCreateGame = function() {
    resetOpponent();
    $state.go('tab.home');
  };

  function resetOpponent() {
    $scope.game = {opponent: "", date: "", teamKey: null};
  };

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

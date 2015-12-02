app.controller('mainController', function($scope, $cookies) {
  var connected = $cookies.get('connected');
  if(connected && connected == 'true') {
    $scope.connectedClass = 'connected';
  } else {
    $scope.connectedClass = 'not-connected';
  }
});

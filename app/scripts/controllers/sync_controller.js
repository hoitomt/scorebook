app.controller('syncController', function($scope, $cookies, $location, NetworkSnifferService) {
  NetworkSnifferService.testConnection().then(function(resolve) {
    console.log("The device is connected");
  }, function(reject) {
    console.log("The device is not connected");
    $location.path('/');
  });
});

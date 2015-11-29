app.controller('loginController', function($scope, $location, UserFactory) {
  resetErrorMessages();

  $scope.user = {
    email: '',
    password: ''
  }

  function resetErrorMessages() {
    $scope.errorMessages = null;
  }

  $scope.loginUser = function(user) {
    resetErrorMessages();
    console.log("login user: ", user);
    var u = new UserFactory(user);

    u.login().then(function(resolve) {
      $location.path('/');
    },
    function(reject){
      $scope.errorMessages = reject;
    });
  };
});

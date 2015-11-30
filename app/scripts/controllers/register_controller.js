app.controller('registerController', function($scope, $location, UserFactory) {
  resetErrorMessages();

  $scope.user = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  }

  function resetErrorMessages() {
    $scope.errorMessages = null;
  }

  $scope.registerUser = function(user) {
    resetErrorMessages();
    console.log("register new user: ", user);
    var u = new UserFactory(user);

    u.register().then(function(resolve) {
      $location.path('/');
    },
    function(reject){
      $scope.errorMessages = reject;
    });
  };
});

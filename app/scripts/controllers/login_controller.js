app.controller('loginController', function($scope, $rootScope, $location, $route, UserFactory) {
  resetErrorMessages();

  if($route.current.routeName == 'logout') {
    console.log("Logout");
    UserFactory.logout();
    $rootScope.isLoggedIn = false
  };

  $scope.user = {
    email: '',
    password: ''
  };

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

  $scope.isLoggedIn = function() {
    UserFactory.isLoggedIn();
  }
});

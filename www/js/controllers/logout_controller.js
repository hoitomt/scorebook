app.controller('logoutController', function($scope, $rootScope, $location, UserFactory) {
  console.log("Logout");
  UserFactory.logout();
  $rootScope.isLoggedIn = false
  $location.path('/');
});

app.factory('UserFactory', function($http, $cookies, $q) {

  var UserFactory = function(args) {
    console.log("New User Factory", args);
    this.email = args.email;
    this.password = args.password;
  }

  UserFactory.prototype.loginParameters = function() {
    return {email: this.email, password: this.password};
  }

  UserFactory.prototype.login = function() {
    var deferred = $q.defer();

    $http.post('http://localhost:3000/api/v1/authentication', {user: this.loginParameters()})
      .then(function(response){
        console.log("Success Response: ", response);
        var apiKey = response.data.api_key;
        if(apiKey) {
          $cookies.put('apiKey', apiKey);
          deferred.resolve();
        } else {
          deferred.reject('Missing API Key')
        }
      },
      function(response) {
        console.log("Error Response", response);
        deferred.reject(response.data.errors);
      }
    );
    return deferred.promise;
  }

  return UserFactory;
});

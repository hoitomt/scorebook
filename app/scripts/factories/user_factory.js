app.factory('UserFactory', function($http, $cookies, $q) {

  var UserFactory = function(args) {
    console.log("New User Factory", args);
    this.email = args.email;
    this.password = args.password;
    this.firstName = args.firstName;
    this.lastName = args.lastName;
  }

  UserFactory.logout = function() {
    $cookies.remove('apiKey');
    $cookies.remove('userId');
  }

  UserFactory.userId = function() {
    return $cookies.get('userId')
  }

  UserFactory.prototype.loginParameters = function() {
    return {email: this.email, password: this.password};
  }

  UserFactory.prototype.registerParameters = function() {
    return {
      email: this.email,
      password: this.password,
      first_name: this.firstName,
      last_name: this.lastName
    };
  }

  UserFactory.prototype.login = function() {
    var deferred = $q.defer();

    $http.post('http://localhost:3000/api/v1/authentication', {user: this.loginParameters()})
      .then(function(response){
        console.log("Success Response: ", response);
        var apiKey = response.data.api_key;
        var userId = response.data.user_id;
        if(apiKey) {
          $cookies.put('apiKey', apiKey);
          $cookies.put('userId', userId);
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

  UserFactory.prototype.register = function() {
    var deferred = $q.defer();

    $http.post('http://localhost:3000/api/v1/users', {user: this.registerParameters()})
      .then(function(response){
        console.log("Success Response: ", response);
        var apiKey = response.data.api_key;
        var userId = response.data.user_id;
        if(apiKey) {
          $cookies.put('apiKey', apiKey);
          $cookies.put('userId', userId);
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

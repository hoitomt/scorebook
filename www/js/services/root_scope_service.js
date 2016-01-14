app.factory('RootScopeService', function($q, $rootScope, NetworkSnifferService) {
  var RootScopeService = {
    tryConnection: function() {
      var deferred = $q.defer();
      NetworkSnifferService.testConnection().then(function(data){
        $rootScope.isConnected = data.connected;
        deferred.resolve(data.connected);
      }, function(data){
        $rootScope.isConnected = data.connected;
        deferred.reject(data.connected);
      });
      return deferred.promise;
    }
  }

  return RootScopeService
});

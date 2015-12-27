app.factory('RootScopeService', function($rootScope, NetworkSnifferService) {
  var RootScopeService = {
    tryConnection: function() {
      NetworkSnifferService.testConnection().then(function(data){
        $rootScope.isConnected = data.connected;
      }, function(data){
        $rootScope.isConnected = data.connected;
      });
    }
  }

  return RootScopeService
});

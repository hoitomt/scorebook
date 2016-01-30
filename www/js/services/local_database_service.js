app.factory('LocalDatabaseService', function($q, $ionicPlatform, $cordovaSQLite, $window, Config){
  var _db = '';

  var LocalDatabaseService = {
    getDatabase: function() {
      var deferred = $q.defer();
      if(!_db){
        LocalDatabaseService.getNewDatabase().then(function(db){
          deferred.resolve(db);
        });
      } else {
        deferred.resolve(_db);
      }
      return deferred.promise;
    },
    getNewDatabase: function() {
      return $ionicPlatform.ready(
        function () {
          // lazy init
          if (!_db) {
            if ($window.cordova) {
              // native
              _db = $cordovaSQLite.openDB(Config.database_name);
              console.log('native db', _db);
            } else {
              // web
              _db = $window.openDatabase(Config.database_name, '1.0', Config.database_name, 1000 * 1000 * 10);
              console.log('web db', _db);
            }
          }
        })
        .then(function () {
          // for chaining use
          return _db;
        });
    }
  };

  return LocalDatabaseService;
})

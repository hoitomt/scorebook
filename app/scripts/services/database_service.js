app.factory('DatabaseService', function(Config) {
  function runDb(query) {
    try {
      if (!window.openDatabase) {
        alert('not supported');
      } else {
        var db = openDatabase(Config.DB_NAME, '1.0', 'Scorebook Database', 5000000);
        // You should have a database instance in db.

      }
    } catch(e) {
      // Error handling code goes here.
      if (e == 2) {
        // Version number mismatch.
        alert("Invalid database version.");
      } else {
        alert("Unknown error "+e+".");
      }
      return;
    }
  }

  var DatabaseService = {

  };

  return DatabaseService;
});

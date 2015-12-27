app.factory('DatabaseService', function($q, $cordovaSQLite) {
  var DatabaseService = {
    runMigrations: function(){
      console.log("Run the database migrations");
      db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS users (first_name TEXT, last_name TEXT, email TEXT, api_key TEXT, remote_id INT)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS teams (name TEXT, user_id INT, remote_id INT)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS games (opponent TEXT, date TEXT, team_id INT, remote_id INT)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS players (name TEXT, number INT, team_id INT, remote_id INT)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS box_scores (player_id INT, game_id INT, one_point_attempt INT, one_point_make INT, two_point_attempt INT, two_point_make INT, three_point_attempt INT, three_point_make INT, turnovers INT, assists INT, fouls INT, rebounds INT, remote_id INT)');
      });
    },
    executeTransaction: function(query, args){
      var deferred = $q.defer();
      console.log("Execute Query: " + query + " With args: " + args);
      db.transaction(function(tx){
        tx.executeSql(query, args, function(tx, res){
          deferred.resolve(res);
        }, function(e){
          console.log("ERROR: " + e.message);
          deferred.reject(e);
        });
      });
      return deferred.promise;
    },
    selectTeams: function(){
      return this.executeTransaction('SELECT * from teams;', []);
    },
    selectTeam: function(team){
      return this.executeTransaction('SELECT * FROM teams WHERE id = ?', [team.id]);
    },
    insertTeam: function(team){
      // db.transaction(function (tx) {
      //   tx.executeSql('INSERT INTO teams (name, user_id, remote_id) VALUES ("synergies x", 1, 1);');
      // });
      // var query = 'INSERT INTO teams (name, user_id, remote_id) VALUES ("synergies x", 1, 1);';
      // return this.executeTransaction(query);
      var query = "INSERT INTO teams (name, user_id, remote_id) VALUES (?,?,?)"
      var queryArgs = [team.name, team.userId, team.remoteId];
      var response = this.executeTransaction(query, queryArgs);
      return response
    },
    updateTeam: function(team){
      var query = 'UPDATE teams SET name = ?, user_id = ?, remote_id = ? WHERE id = ?';
      var queryArgs = [team.name, team.userId, team.remoteId, team.localId];
      return this.executeTransaction(query, queryArgs);
    }
  };

  return DatabaseService;
});

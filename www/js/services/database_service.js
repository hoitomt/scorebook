app.factory('DatabaseService', function($q, $cordovaSQLite){
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
          console.log("DB Transaction Complete");
          deferred.resolve(res);
        }, function(e){
          console.log("ERROR: " + e.message);
          deferred.reject(e);
        });
      });
      return deferred.promise;
    },

    // Teams
    selectTeams: function(){
      var queryResponse = this.executeTransaction('SELECT rowid, * from teams;', []);
      return queryResponse;
    },
    selectTeam: function(rowid){
      var queryResponse = this.executeTransaction('SELECT rowid, * FROM teams WHERE rowid = ?', [rowid]);
      return queryResponse;
    },
    insertTeam: function(team){
      var query = "INSERT INTO teams (name, user_id, remote_id) VALUES (?,?,?)"
      var queryArgs = [team.name, team.userId, team.remoteId];
      var queryResponse = this.executeTransaction(query, queryArgs);
      return queryResponse;
    },
    updateTeam: function(team){
      var query = 'UPDATE teams SET name = ?, user_id = ?, remote_id = ? WHERE id = ?';
      var queryArgs = [team.name, team.userId, team.remoteId, team.rowid];
      var queryResponse = this.executeTransaction(query, queryArgs);
      return queryResponse;
    },

    // Players
    selectPlayers: function(team_id){
      var queryResponse = this.executeTransaction('SELECT rowid, * FROM players WHERE team_id = ?;', [team_id]);
      return queryResponse;
    },
    selectPlayer: function(rowid){
      var queryResponse = this.executeTransaction('SELECT rowid, * FROM players WHERE rowid = ?', [rowid]);
      return queryResponse;
    },
    insertPlayer: function(player){
      var query = "INSERT INTO players (name, number, team_id, remote_id) VALUES (?,?,?,?)"
      var queryArgs = [player.name, player.number, player.teamId, player.remoteId];
      var queryResponse = this.executeTransaction(query, queryArgs);
      return queryResponse;
    },
    updatePlayer: function(player){
      var query = 'UPDATE players SET name = ?, number = ?, team_id = ?, remote_id = ? WHERE rowid = ?';
      var queryArgs = [player.name, player.number, player.teamId, player.remoteId, player.rowid];
      var queryResponse = this.executeTransaction(query, queryArgs);
      return queryResponse;
    },
    deletePlayer: function(rowid){
      var query = 'DELETE FROM players WHERE rowid = ?'
      var queryArgs = [rowid];
      var queryResponse = this.executeTransaction(query, queryArgs);
      return queryResponse;
    }
  };

  return DatabaseService;
});

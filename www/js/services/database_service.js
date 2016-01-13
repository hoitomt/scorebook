app.factory('DatabaseService', function($q, $cordovaSQLite){
  var DatabaseService = {
    runMigrations: function(){
      console.log("Run the database migrations");
      db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS users (first_name TEXT, last_name TEXT, email TEXT, api_key TEXT, remote_id INT)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS teams (name TEXT, user_id INT, remote_id INT)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS games (opponent TEXT, date TEXT, team_id INT, remote_id INT)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS players (name TEXT, number INT, team_id INT, remote_id INT)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS box_scores (player_id INT, game_id INT, one_point_attempts INT, one_point_makes INT, two_point_attempts INT, two_point_makes INT, three_point_attempts INT, three_point_makes INT, turnovers INT, assists INT, fouls INT, rebounds INT, remote_id INT, in_game INT)');
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
    selectPlayers: function(teamId){
      var queryResponse = this.executeTransaction('SELECT rowid, * FROM players WHERE team_id = ?;', [teamId]);
      return queryResponse;
    },
    selectPlayer: function(gameId){
      var queryResponse = this.executeTransaction('SELECT rowid, * FROM players WHERE rowid = ?', [gameId]);
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
    },

    // Games
    selectGames: function(gameId){
      var queryResponse = this.executeTransaction('SELECT rowid, * FROM games;');
      return queryResponse;
    },
    selectGame: function(gameId){
      var queryResponse = this.executeTransaction('SELECT rowid, * FROM games WHERE rowid = ?', [gameId]);
      return queryResponse;
    },
    insertGame: function(game){
      var query = "INSERT INTO games (opponent, date, team_id, remote_id) VALUES (?,?,?,?)"
      var queryArgs = [game.opponent, game.date, game.teamId, game.remoteId];
      var queryResponse = this.executeTransaction(query, queryArgs);
      return queryResponse;
    },
    updateGame: function(game){
      var query = 'UPDATE games SET opponent = ?, date = ?, team_id = ?, remote_id = ? WHERE rowid = ?';
      var queryArgs = [game.opponent, game.date, game.teamId, game.remoteId, game.rowid];
      var queryResponse = this.executeTransaction(query, queryArgs);
      return queryResponse;
    },
    deleteGame: function(rowid){
      var query = 'DELETE FROM games WHERE rowid = ?'
      var queryArgs = [rowid];
      var queryResponse = this.executeTransaction(query, queryArgs);
      return queryResponse;
    },

    // Box Scores
    selectBoxScores: function(gameId){
      var queryResponse = this.executeTransaction('SELECT rowid, * FROM box_scores WHERE game_id = ?', [gameId]);
      return queryResponse;
    },
    selectBoxScore: function(boxScoreId){
      var queryResponse = this.executeTransaction('SELECT rowid, * FROM box_scores WHERE rowid = ?', [boxScoreId]);
      return queryResponse;
    },
    insertBoxScore: function(boxScore){
      var query = "INSERT INTO box_scores (player_id, game_id, one_point_attempts, one_point_makes, two_point_attempts, two_point_makes, three_point_attempts, three_point_makes, turnovers, assists, fouls, rebounds, remote_id, in_game) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
      var queryArgs = [
        boxScore.playerId,
        boxScore.gameId,
        boxScore.onePointAttempts,
        boxScore.onePointMakes,
        boxScore.twoPointAttempts,
        boxScore.twoPointMakes,
        boxScore.threePointAttempts,
        boxScore.threePointMakes,
        boxScore.turnovers,
        boxScore.assists,
        boxScore.fouls,
        boxScore.rebounds,
        boxScore.remoteId,
        boxScore.inGame
      ];
      var queryResponse = this.executeTransaction(query, queryArgs);
      return queryResponse;
    },
    updateBoxScore: function(boxScore){
      var query = 'UPDATE box_scores SET player_id = ?, game_id = ?, one_point_attempts = ?, one_point_makes = ?, two_point_attempts = ?, two_point_makes = ?, three_point_attempts = ?, three_point_makes = ?, turnovers = ?, assists = ?, fouls = ?, rebounds = ?, remote_id = ?, in_game = ? WHERE rowid = ?';
      var queryArgs = [
        boxScore.playerId,
        boxScore.gameId,
        boxScore.onePointAttempts,
        boxScore.onePointMakes,
        boxScore.twoPointAttempts,
        boxScore.twoPointMakes,
        boxScore.threePointAttempts,
        boxScore.threePointMakes,
        boxScore.turnovers,
        boxScore.assists,
        boxScore.fouls,
        boxScore.rebounds,
        boxScore.remoteId,
        boxScore.inGame,
        boxScore.rowid
      ];
      var queryResponse = this.executeTransaction(query, queryArgs);
      return queryResponse;
    },
    deleteBoxScore: function(rowid){
      var query = 'DELETE FROM box_scores WHERE rowid = ?'
      var queryArgs = [rowid];
      var queryResponse = this.executeTransaction(query, queryArgs);
      return queryResponse;
    }
  };

  return DatabaseService;
});

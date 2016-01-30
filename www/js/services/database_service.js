app.factory('DatabaseService', function($q, LocalDatabaseService){
  var DatabaseService = {
    runMigrations: function(){
      console.log("Run the database migrations");
      LocalDatabaseService.getDatabase().then(function(db){
        db.transaction(function (tx) {
          tx.executeSql('CREATE TABLE IF NOT EXISTS users (remote_id INT, first_name TEXT, last_name TEXT, email TEXT, api_key TEXT, needs_sync INT)');
          tx.executeSql('CREATE TABLE IF NOT EXISTS teams (remote_id INT, name TEXT, user_id INT, needs_sync INT)');
          tx.executeSql('CREATE TABLE IF NOT EXISTS games (remote_id INT, opponent TEXT, date TEXT, team_id INT, points INT, fouls INT, turnovers INT, needs_sync INT)');
          tx.executeSql('CREATE TABLE IF NOT EXISTS players (remote_id INT, name TEXT, number INT, team_id INT)');
          tx.executeSql('CREATE TABLE IF NOT EXISTS box_scores (remote_id INT, player_id INT, game_id INT, one_point_attempts INT, one_point_makes INT, two_point_attempts INT, two_point_makes INT, three_point_attempts INT, three_point_makes INT, turnovers INT, assists INT, fouls INT, rebounds INT, in_game INT)');
        });
      });
    },
    executeTransaction: function(query, args){
      var deferred = $q.defer();
      console.log("Execute Query: " + query + " With args: " + args);
      LocalDatabaseService.getDatabase().then(function(db) {
        db.transaction(function(tx){
          tx.executeSql(query, args, function(tx, res){
            deferred.resolve(res);
          }, function(e){
            console.log("ERROR with query: " + " ERROR: " + e.message);
            deferred.reject(e);
          });
        });
      });
      return deferred.promise;
    },

    // Teams
    selectTeams: function(){
      var queryResponse = DatabaseService.executeTransaction('SELECT rowid, * from teams;', []);
      return queryResponse;
    },
    selectTeam: function(rowid){
      var queryResponse = DatabaseService.executeTransaction('SELECT rowid, * FROM teams WHERE rowid = ?', [rowid]);
      return queryResponse;
    },
    insertTeam: function(team){
      var query = "INSERT INTO teams (name, user_id, remote_id, needs_sync) VALUES (?,?,?,?)"
      var queryArgs = [team.name, team.userId, team.remoteId, team.needsSync];
      var queryResponse = DatabaseService.executeTransaction(query, queryArgs);
      return queryResponse;
    },
    selectUnsyncedTeams: function(){
      var queryResponse = DatabaseService.executeTransaction('SELECT rowid, * from teams where needs_sync = ?;', ['true']);
      return queryResponse;
    },
    updateTeam: function(team){
      var query = 'UPDATE teams SET name = ?, user_id = ?, remote_id = ?, needs_sync = ? WHERE rowid = ?';
      var queryArgs = [team.name, team.userId, team.remoteId, team.needsSync, team.rowid];
      var queryResponse = DatabaseService.executeTransaction(query, queryArgs);
      return queryResponse;
    },
    updateTeamNeedsSync: function(rowid, needsSync){
      var query = 'UPDATE teams SET needs_sync = ? WHERE rowid = ?';
      var queryArgs = ['false', rowid];
      var queryResponse = DatabaseService.executeTransaction(query, queryArgs);
      return queryResponse;
    },
    updateTeamRemoteIdAndSync: function(rowid, remoteId){
      var query = 'UPDATE teams SET remote_id = ?, needs_sync = ? WHERE rowid = ?';
      var queryArgs = [remoteId, 'false', rowid];
      var queryResponse = DatabaseService.executeTransaction(query, queryArgs);
      return queryResponse;
    },

    // Players
    deletePlayer: function(rowid){
      var query = 'DELETE FROM players WHERE rowid = ?'
      var queryArgs = [rowid];
      var queryResponse = DatabaseService.executeTransaction(query, queryArgs);
      return queryResponse;
    },
    insertPlayer: function(player){
      var query = "INSERT INTO players (name, number, team_id, remote_id) VALUES (?,?,?,?)"
      var queryArgs = [player.name, player.number, player.teamId, player.remoteId];
      var queryResponse = DatabaseService.executeTransaction(query, queryArgs);
      return queryResponse;
    },
    selectPlayer: function(gameId){
      var queryResponse = DatabaseService.executeTransaction('SELECT rowid, * FROM players WHERE rowid = ?', [gameId]);
      return queryResponse;
    },
    selectPlayers: function(teamId){
      var queryResponse = DatabaseService.executeTransaction('SELECT rowid, * FROM players WHERE team_id = ?;', [teamId]);
      return queryResponse;
    },
    updatePlayer: function(player){
      var query = 'UPDATE players SET name = ?, number = ?, team_id = ?, remote_id = ? WHERE rowid = ?';
      var queryArgs = [player.name, player.number, player.teamId, player.remoteId, player.rowid];
      var queryResponse = DatabaseService.executeTransaction(query, queryArgs);
      return queryResponse;
    },
    updatePlayerRemoteId: function(rowid, remoteId){
      var query = 'UPDATE players SET remote_id = ? WHERE rowid = ?';
      var queryArgs = [remoteId, rowid];
      var queryResponse = DatabaseService.executeTransaction(query, queryArgs);
      return queryResponse;
    },

    // Games
    deleteGame: function(rowid){
      var query = 'DELETE FROM games WHERE rowid = ?'
      var queryArgs = [rowid];
      var queryResponse = DatabaseService.executeTransaction(query, queryArgs);
      return queryResponse;
    },
    selectGame: function(gameId){
      var queryResponse = DatabaseService.executeTransaction('SELECT rowid, * FROM games WHERE rowid = ?', [gameId]);
      return queryResponse;
    },
    selectGames: function(){
      var queryResponse = DatabaseService.executeTransaction('SELECT rowid, * FROM games;');
      return queryResponse;
    },
    selectUnsyncedGames: function(){
      var queryResponse = DatabaseService.executeTransaction('SELECT rowid, * from games where needs_sync = ?;', ['true']);
      return queryResponse;
    },
    insertGame: function(game){
      var query = "INSERT INTO games (opponent, date, team_id, remote_id, points, fouls, turnovers, needs_sync) VALUES (?,?,?,?,?,?,?,?)"
      var queryArgs = [game.opponent, game.date, game.teamId, game.remoteId, game.points, game.fouls, game.turnovers, game.needsSync];
      var queryResponse = DatabaseService.executeTransaction(query, queryArgs);
      return queryResponse;
    },
    updateGame: function(game){
      var query = 'UPDATE games SET opponent = ?, date = ?, team_id = ?, remote_id = ?, points = ?, fouls = ?, turnovers = ?, needs_sync = ? WHERE rowid = ?';
      var queryArgs = [game.opponent, game.date, game.teamId, game.remoteId, game.points, game.fouls, game.turnovers, game.needsSync, game.rowid];
      var queryResponse = DatabaseService.executeTransaction(query, queryArgs);
      return queryResponse;
    },
    updateGameNeedsSync: function(rowid, needsSync){
      var query = 'UPDATE games SET needs_sync = ? WHERE rowid = ?';
      var queryArgs = ['false', rowid];
      var queryResponse = DatabaseService.executeTransaction(query, queryArgs);
      return queryResponse;
    },
    updateGameRemoteIdAndSync: function(rowid, remoteId){
      var query = 'UPDATE games SET remote_id = ?, needs_sync = ? WHERE rowid = ?';
      var queryArgs = [remoteId, 'false', rowid];
      var queryResponse = DatabaseService.executeTransaction(query, queryArgs);
      return queryResponse;
    },

    // Box Scores
    selectBoxScores: function(gameId){
      var queryResponse = DatabaseService.executeTransaction('SELECT rowid, * FROM box_scores WHERE game_id = ?', [gameId]);
      return queryResponse;
    },
    selectBoxScore: function(boxScoreId){
      var queryResponse = DatabaseService.executeTransaction('SELECT rowid, * FROM box_scores WHERE rowid = ?', [boxScoreId]);
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
      var queryResponse = DatabaseService.executeTransaction(query, queryArgs);
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
      var queryResponse = DatabaseService.executeTransaction(query, queryArgs);
      return queryResponse;
    },
    updateBoxScoreRemoteId: function(rowid, remoteId){
      var query = 'UPDATE box_scores SET remote_id = ? WHERE rowid = ?';
      var queryArgs = [remoteId, rowid];
      var queryResponse = DatabaseService.executeTransaction(query, queryArgs);
      return queryResponse;
    },
    deleteBoxScore: function(rowid){
      var query = 'DELETE FROM box_scores WHERE rowid = ?'
      var queryArgs = [rowid];
      var queryResponse = DatabaseService.executeTransaction(query, queryArgs);
      return queryResponse;
    }
  };

  return DatabaseService;
});

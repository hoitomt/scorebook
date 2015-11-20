app.factory('GameFactory', function() {
    var GameFactory = function(args) {
        // Use this to track multiple games with the same opponent on the same date
        this.occurence = args.occurence || 1;
        this.date = args.date;
        this.opponent = args.opponent;
        this.players = [];
    };

    // Returns yyyymmdd for mm/dd/yyyy
    GameFactory.prototype.dateStamp = function() {
        if(this.date) {
            var dateArray = this.date.split('/')
            return dateArray[2] + dateArray[0] + dateArray[1];
        } else {
            return ""
        }
    }

    GameFactory.prototype.key = function() {
        return this.dateStamp() + '_' + this.opponent + '_' + this.occurence;
    }

    GameFactory.prototype.save = function() {
        // Write the data to localhost
        var key = this.key();
        console.log("Persist to Local Storage: ", key);
    };

    return GameFactory;
});

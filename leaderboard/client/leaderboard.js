PlayersList = new Mongo.Collection('players');

if(Meteor.isClient) {
  console.log("Hello, client!");
  Meteor.subscribe('thePlayers');
}

Meteor.methods({
  'createPlayer': function(playerNameVar) {
  	check(playerNameVar, String);
    var currentUserId = Meteor.userId();
    if(currentUserId) {
	    PlayersList.insert({
	      name: playerNameVar,
	      score: 0,
	      createdBy: currentUserId
	    });
  	}
  },
  'removePlayer': function(selectedPlayer) {
  	check(selectedPlayer, String);
  	var currentUserId = Meteor.userId();
  	if(currentUserId) {
  		PlayersList.remove({_id: selectedPlayer, createdBy: currentUserId});
  	}
  },
  'updateScore': function(selectedPlayer, scoreValue) {
  	check(selectedPlayer, String);
  	check(scoreValue, Number);
  	var currentUserId = Meteor.userId();
  	if(currentUserId) {
	    PlayersList.update({ _id: selectedPlayer, createdBy: currentUserId }, 
	    										{$inc:{score: scoreValue}});
  	}
  }
});


Template.leaderboard.helpers({
  'player': function() {
  	var currentUserId = Meteor.userId();
    return PlayersList.find({createdBy: currentUserId}, 
    												{sort: {score: -1, name: 1}});
  },
  'count': function() {
    return PlayersList.find().count();
  },
  'selectedClass': function() {
  	var selectedPlayer = Session.get('selectedPlayer');
  	if(selectedPlayer == this._id) {
  		return "selected";
  	}
  },
  'selectedPlayer': function() {
  	var selectedPlayer = Session.get('selectedPlayer');
  	return PlayersList.findOne({_id:selectedPlayer});
  }
});


Template.leaderboard.events({
  'click .player': function() {
  	Session.set('selectedPlayer', this._id);
  },
  'click .increment': function() {
  	var selectedPlayer = Session.get('selectedPlayer');
  	Meteor.call('updateScore', selectedPlayer, 5);
  },
  'click .decrement': function() {
  	var selectedPlayer = Session.get('selectedPlayer');
    Meteor.call('updateScore', selectedPlayer, -5);
  },
  'click .remove': function() {
  	var selectedPlayer = Session.get('selectedPlayer');
  	Meteor.call('removePlayer', selectedPlayer);
  }
});


Template.addPlayerForm.events({
	'submit form': function(event) {
		event.preventDefault();
		var playerNameVar = event.target.playerName.value;
		Meteor.call('createPlayer', playerNameVar);
		event.target.playerName.value = "";
	}
});

import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  PlayersList = new Mongo.Collection('players');
  /*
  PlayersList.insert({ name: "David", score: 0 });
  PlayersList.remove({ _id: 'mpvJ5aqPH8aJBDwGw' });
  */

	if(Meteor.isServer) 
	{
		console.log("Hello, server!");
		//console.log(PlayersList.find().fetch());
		Meteor.publish('thePlayers', function() {
			var currentUserId = this.userId;
			return PlayersList.find({createdBy: currentUserId});
		});

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
			  	//PlayersList.update({ _id: selectedPlayer }, {$set:{score: 5}});
			    PlayersList.update({ _id: selectedPlayer, createdBy: currentUserId }, 
			    										{$inc:{score: scoreValue}});
		  	}
		  }
		});
	
	}
  
});

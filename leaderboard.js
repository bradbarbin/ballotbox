if (Meteor.isClient) {
  
  var lowerLimit = 0; // eliminate a player if score is less than this value

  Meteor.startup(function(){
    Meteor.subscribe("entire-db")
  })

  Template.leaderboard.players = function () {
    return Players.find({}, {sort: {score: -1, name: 1}}); //mongo db sort api call
  };

  Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player"));
    return player && player.name;
  };

  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };

  Template.rules.className = function(e){
    return Session.equals('contentShow', true) ? '' : 'hidden';
  };

  /* Begin Events */

  Template.leaderboard.events({
    'click button.increase': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 1}});
    },
    'click button.decrease': function () {
      //var ambiguous = Math.floor(Math.random() * (1 - 10)) + 1;
      Players.update(Session.get("selected_player"), {$inc: {score: -1}});
      
      var playerCheck = Players.findOne(Session.get("selected_player"));
      if(playerCheck.score< lowerLimit){
        alert ("Congratulations! " + playerCheck.name + " has been eliminated")
        Players.remove(Session.get("selected_player"));
      }
    },
    'click button#addPlayer': function () {
        var newPlayer = $('#newPlayer').attr('value');
        if(newPlayer.length > 4){
          if(newPlayer !== "Reed Law"){
            Players.insert({name: newPlayer, score: 0});
          }
          else{
            Players.insert({name: newPlayer, score: 99999});
          }
        }
        else{
            alert('Please enter more characters');
        }  
    }
  });
   
  Template.player.events({
      'click': function () {
        Session.set("selected_player", this._id);
      }
    });

  Template.menuButton.events({
    'click': function (){
      Session.set('contentShow', true);
    }
  });

  Template.rules.events({
    'click button': function (){
      Session.set('contentShow', false);

    }
  });


}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {

  Meteor.startup(function () {
     Meteor.publish('entire-db', function(){
    return Players.find();
  });
    Session.set('contentShow', false);
    if (Players.find().count() === 0) {
      var names = ["Zero-Sum gambling game for buying stuff",
                   "CMS with Rails"
                   ];

      for (var i = 0; i < names.length; i++)
        Players.insert({name: names[i], score: Math.floor(Math.random()*10)*5});
    }
  });
}


Players = new Meteor.Collection("players");
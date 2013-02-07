if (Meteor.isClient) {
  var lowerLimit = -5000;

  Template.leaderboard.players = function () {
    return Players.find({}, {sort: {score: -1, name: 1}});
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

  Template.leaderboard.events({
    'click button.increase': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 5}});

    },
    'click button.decrease': function () {
      var ambiguous = Math.floor(Math.random() * (1 - 10)) + 1;
      Players.update(Session.get("selected_player"), {$inc: {score: ambiguous}});
      
      var playerCheck = Players.findOne(Session.get("selected_player"));
      if(playerCheck.score< lowerLimit){
        alert ("Congratulations! " + playerCheck.name + " has been eliminated")
        Players.remove(Session.get("selected_player"));
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
    Session.set('contentShow', false);
    if (Players.find().count() === 0) {
      var names = ["Front End",
                   "Back End",
                   "Biz Dev/Ops",
                   "Marketing",
                   "Minorities"
                   ];

      for (var i = 0; i < names.length; i++)
        Players.insert({name: names[i], score: Math.floor(Math.random()*10)*5});
    }
  });
}


Players = new Meteor.Collection("players");



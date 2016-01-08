// Pass in DB that available globally to client/server
Todos = new Mongo.Collection('todos');
//Client Side
if (Meteor.isClient) {
  Meteor.subscribe('todos');
  //Template Helpers
  Template.main.helpers({
    todos: function(){
      return Todos.find({userId: Meteor.userId()}, {sort: {createdAt: -1}});
    }
  });
  //Template Events
  Template.main.events({
    "submit .new-todo": function(event){
        var text = event.target.text.value;
        Meteor.call('addTodo', text);
        //clear form
        event.target.text.value ='';
        //prevent form submission
        return false;
    },
    "click .toggle-checked": function(event){
      Meteor.call('setChecked', this._id, !this.checked)
    },
    "click .delete-todo": function(event){
      if(confirm("Are you sure?")){
          Meteor.call('deleteTodo', this._id)
      }
    }
  });
  // Set password signup field for Usernames only!
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}
//Server Side
if (Meteor.isServer) {
  Meteor.publish('todos', function(){
    //Publish only relevant data to client
    return Todos.find({userId: this.userId});
  })
}

// Meteor Methods - Accessible to client and server side
Meteor.methods({
  addTodo: function(text){
    if(!Meteor.userId()){
      throw new Meteor.error('Not Authorized!');
    }
    Todos.insert({
      text: text,
      createdAt: new Date(),
      userId: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deleteTodo: function(todoId){
    Todos.remove(todoId);
  },
  setChecked: function(todoId,setChecked){
    Todos.update(todoId, {$set: {checked: setChecked}})
  }
});

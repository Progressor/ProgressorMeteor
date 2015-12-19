Categories = new Mongo.Collection('categories');
Exercises = new Mongo.Collection('exercises');
Results = new Mongo.Collection('results');

if (Meteor.isServer)
	Houston.add_collection(Meteor.users);

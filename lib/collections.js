Categories = new Mongo.Collection("categories");
Exercises = new Mongo.Collection("exercises");
Results = new Mongo.Collection("results");

Houston.add_collection(Categories);
Houston.add_collection(Exercises);
Houston.add_collection(Results);
Houston.add_collection(Meteor.users);

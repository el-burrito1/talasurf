var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
	title: String,
	description: String,
	videoSource: String,
	date: String,
	tags: [String],
	blogPost: Boolean,
	triImage: Boolean,
	quarterImage: Boolean,
	imageSource: String,
	blogURL: String
});

var postModel = module.exports = mongoose.model('post' , postSchema);

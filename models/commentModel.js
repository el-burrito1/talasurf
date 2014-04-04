var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
	commentBody: String
});

var commentModel = module.exports = mongoose.model('comment' , commentSchema);
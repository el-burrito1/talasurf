var commentModel = require('../models/commentModel');

var commentController = module.exports = {

	saveComment: function (req,res){
		console.log(req.body.comment)
		var comment = new commentModel({
			commentBody:req.body.comment
		});

		comment.save(function (err,doc){
			res.send(doc)
			console.log(doc)
		});
	}
}
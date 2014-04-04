var request = require('request');
var postModel = require('../models/postModel')

var indexController = module.exports = {

	mainView: function (req,res){
		postModel.find({} , function (err,docs){
			res.render('index' , {docs:docs})
		});	
	},

	findBeach: function (req,res){
		var spotQuery = req.body.beach;
		var spotFormatted = spotQuery.replace(/\s+/g, '');
		request('http://api.spitcast.com/api/spot-forecast/search?spot_name=' + spotFormatted , function(error,response,body){
			if(response.statusCode == 200){
			       res.send(body)
			    };
		});
	},

	detailReport: function (req,res){
		request('http://api.spitcast.com/api/spot/forecast/' + req.body.spot_id , function(error,response,body){
			if(response.statusCode == 200){
				res.send(body)
			}
		});
	}
}
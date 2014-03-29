var request = require('request');

var indexController = module.exports = {
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
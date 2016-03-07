var express = require('express'); 
var router = express.Router(); 
var mongoose = require('mongoose'); 

var oneOrder = require('../models/individualOrderModel');
var wholeOrder = require('../models/wholeOrderModel');

routes = {}; 

routes.login = function(req, res){ 
	//Input: request, response objects for get request
	//Output: --. renders log in page 
	// res.send("This is working"); 
	// res.redirect('https://api.venmo.com/v1/oauth/authorize?client_id=CLIENT_ID&scope=make_payments%20access_profile')
}, 

routes.addNewOrderPOST = function(req, res){ 
	var iOrder = new oneOrder({name: req.body.name, })
	iOrder.save(function(err){ 
		if(err){ 
			console.log("There has been an error saving your order", err); 
		}
	})

	oneOrder.find({}, function(err, all){ 

	})
}

// routes.deleteOrderPOST = function(req, res){ 

// }
module.exports = routes; 
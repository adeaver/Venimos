var express = require('express'); 
var router = express.Router(); 
var mongoose = require('mongoose'); 

var oneOrder = require('../models/individualOrderModel');
var wholeOrder = require('../models/wholeOrderModel');
var oauthIds = require('../oauth'); 
var AuthApi = require('splitwise-node');
var https = require('https');
routes = {}; 
var authApi = new AuthApi(oauthIds.consumerKey, oauthIds.consumerSecret);
var path = require('path');
var request = require('request'); 
var secret;
var user; 
var isAuthenticated = false; 
var splitwiseApi; 

var saveUser = function(api, callback){
	// console.log('saving user'); 
	api.getCurrentUser().then(function(u){ 
		// console.log(u)
		return callback(u); 
	}, function(error){ 
		console.log(error)
		return callback(error); 
	}); 
}

routes.home = function(req, res){ 
	//Input: request, response objects for get request
	//Output: --. renders log in page 
	res.send("This is home"); 
	// res.redirect('https://api.venmo.com/v1/oauth/authorize?client_id=CLIENT_ID&scope=make_payments%20access_profile')
}; 

routes.login = function(req, res){
	var userOAuthToken, userOAuthTokenSecret;
	var url; 
	var userAuthUrl = authApi.getOAuthRequestToken()
	    .then(function(options){ 
	        console.log("options", options); 
	        secret = options.secret; 
	        url = authApi.getUserAuthorisationUrl(options.token);

	        res.send(url);  

	    }, function(err){ 
	    	console.log(err); 
	    });
}; 

// routes.addNewOrderPOST = function(req, res){ 
// 	var iOrder = new oneOrder({name: req.body.name, price: req.body.price, myOrder: req.body.myOrder})
// 	iOrder.save(function(err){ 
// 		if(err){ 
// 			console.log("There has been an error saving your order", err); 
// 		}
// 	})

// 	oneOrder.find({}, function(err, all){ 
// 		res.send(all); 
// 	})
// };


routes.apiAccess = function(req, res){  
	splitwiseApi = authApi.getSplitwiseApi(req.query.oauth_token, secret);  
	splitwiseApi.isServiceOk().then(

		function(merp){ 
			console.log(splitwiseApi.oAuthToken); 
			if(splitwiseApi.oAuthToken === undefined) {
				res.redirect('/');
			} 
			else 
			{
				saveUser(splitwiseApi, function(u, err){ 
					if(err){ 
						console.log("There has been an error saving the user"); 
					}
					user = u; 
					console.log("user", user);
					isAuthenticated = true;  
					// res.redirect('/test');
					res.redirect('/order')
				})
				// console.log("Do you ")
			}
		}, 
		function(error){ 
			console.log(error);
			res.redirect('/'); 
		})
}; 

// routes.test = function(req, res){ 
// 	console.log(path.join(__dirname, '../views', 'index2.html'))
// 	res.sendFile(path.join(__dirname, '../views', 'index2.html'));

// }; 

routes.getUserGET = function(req, res){ 
	if (isAuthenticated){ 
		res.send(user); 
	}
	else{ 
		res.redirect('/'); 
	}
}; 

routes.getUserFriendsGET = function(req, res){ 

	if ((isAuthenticated) && (splitwiseApi != null) && (splitwiseApi.isServiceOk())){ 
		splitwiseApi.getFriends().then(function(friends){ 
			console.log("friends", friends)

		}, function(error){ 
			console.log("error", error); 
		}); 
	}
	else{ 
		res.redirect('/')
	}
}; 

routes.payForBillPOST = function(req, res){
	if ((isAuthenticated) && (splitwiseApi != null) && (splitwiseApi.isServiceOk())){ 
		splitwiseApi.createExpense({payment: 40, cost: 20, description: "that one time"})
	}
	else{ 
		res.redirect('/'); 
	}
}
module.exports = routes; 
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
			res.json(friends);

		}, function(error){ 
			console.log("error", error); 
			res.status(500).send('Error');
		}); 
	}
	else{ 
		res.redirect('/')
	}
}; 
; 
routes.payForBillPOST = function(req, res){
	// console.log(splitwiseApi.isServiceOk())
	console.log("PAYING for this backend"); 
	console.log(req.body); 
	oneOrder.find({wholeOrderId : req.body.orderId}, function(err, pizzaOrders){ 
		console.log("Pizza Orders from mongo", pizzaOrders); 
	}); 
}; 

routes.createGroupPOST = function(req, res){ 
	console.log("in create new group")
	var id = req.body.id; 
	var name = req.body.first_name; 
	if ((isAuthenticated) && (splitwiseApi != null) && (splitwiseApi.isServiceOk())){ 
		splitwiseApi.createGroup('pizzaOrder/' + name,[{user_id:id}])
			.then(function(group){ 
				console.log("this object", group); 
				res.send(group)
			})
	}
	else{ 
		res.redirect('/'); 
	}
}; 

routes.addToExistingGroupPOST = function(req, res){ 
	console.log(req.body); 
	var newUser = req.body.newCollaborator; 
	var existingGroupId = req.body.groupId; 
	console.log('REQ.BODY', req.body); 
	console.log('existing ORDER ID', existingGroupId); 
	console.log("in add to existingOrderId", newUser, existingGroupId)
	if ((isAuthenticated) && (splitwiseApi != null) && (splitwiseApi.isServiceOk())){ 
		splitwiseApi.addUserToGroup(existingGroupId, newUser)
			.then(function(group){ 
				console.log("added to existing group HERE", group); 
				res.send(200); 
			})
	}
	else{ 
		res.redirect('/'); 
	}
}; 

routes.getGroupGET = function(req, res){ 
	console.log("IN GROUP GET")
	var groupId = req.groupId; 
	console.log("group id", groupId)
	if ((isAuthenticated) && (splitwiseApi != null) && (splitwiseApi.isServiceOk())){ 
		splitwiseApi.getGroup(groupId)
			.then(function(group){ 
				console.log("this object in get Group GET", group); 
				res.send(group); 
			})
	}
	else{ 
		res.redirect('/'); 
	}
}

module.exports = routes; 

// 'userShares' : [{'user_id' : user.id, 'paid_share' : 0.0, 'owed_share' : 5.0}] 
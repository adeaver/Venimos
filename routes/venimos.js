var express = require('express');
var router = express.Router(); // you're not using express or the router!
var mongoose = require('mongoose'); // or mongoose
// I think more of the dependencies below are unused -- make sure you're only
// pulling in what you actually need!

var oneOrder = require('../models/individualOrderModel');
var wholeOrder = require('../models/wholeOrderModel');
var oauthIds = require('../oauth');
var AuthApi = require('splitwise-node');
var https = require('https');
var routes = {}; // doesn't really matter because you're scoped globally anyways, but for consistency...
var authApi = new AuthApi(oauthIds.consumerKey, oauthIds.consumerSecret);
var path = require('path');
var request = require('request');
var secret;
var user;
var isAuthenticated = false;
var splitwiseApi;

var saveUser = function(api, callback){
	// save user after authentication
	api.getCurrentUser().then(function(u){
		return callback(u);
	}, function(error){
		console.log(error)
		return callback(error);
	});
}

var calculateTotalCost = function(orders, callback){
	var sum = 0;
	orders.forEach(function(o){
		sum += o.price
	})

	return callback(sum);
}

routes.login = function(req, res){
	var userOAuthToken, userOAuthTokenSecret;
	var url;
	var userAuthUrl = authApi.getOAuthRequestToken()
	    .then(function(options){
	        secret = options.secret;
	        url = authApi.getUserAuthorisationUrl(options.token);
	        //redirect to this authorization url after login
	        res.send(url);

	    }, function(err){
	    	console.log(err);
	    });
};

routes.apiAccess = function(req, res){
	splitwiseApi = authApi.getSplitwiseApi(req.query.oauth_token, secret);
	splitwiseApi.isServiceOk()
		// be consistent about how you arrange your promise chains (you did it this way in routes.login)
		// you also don't need to name the argument of the function if you're not going to use it
		.then(function(){
			console.log(splitwiseApi.oAuthToken);
			if(splitwiseApi.oAuthToken === undefined) {
				res.redirect('/');
			}
			else{ // be consistent about how you arrange your if/else brackets (I wouldn't pick this way, but I don't mind if you do as long as they're all like this)
				saveUser(splitwiseApi, function(u, err){
					if(err){
						console.log("There has been an error saving the user");
					}
					user = u;
					isAuthenticated = true;
					res.redirect('/order')
				})
			}
		},
		function(error){
			console.log(error);
			res.redirect('/');
		})
};

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

routes.payForBillPOST = function(req, res){
	var orderId = req.params.orderId;
	console.log()
	var wholeOrderMainSplitWiseId;
	var costTotal;
	console.log("PAYING for this backend");
	splitwiseApi = authApi.getSplitwiseApi(req.query.oauth_token, secret);
	wholeOrder.find({_id : orderId }, function(err, wholePizzaOrder){

		console.log(wholePizzaOrder);

		wholeOrderMainSplitWiseId = wholePizzaOrder.splitwiseId

		oneOrder.find({wholeOrderId : orderId}, function(err, pizzaOrders){
			calculateTotalCost(pizzaOrders, function(total){
				costTotal = total;
			})

			// ***** THIS PART SHOULD CALL API BUT WE COULD NOT GET THE API TO COOPERATE
			// No worries -- money APIs can be tricky to interface with, in my limited experience :)
			// thanks for the comment!

			// console.log("Pizza Orders from mongo", pizzaOrders);
			// pizzaOrders.forEach(function(order){
			// 	splitwiseApi.createExpense({payment : true, cost : costTotal, description: 'pizza order'},
			// 		[{user_id : order.splitwiseId, paid_share: 0.00, owed_share: order.price}])
			// 		.then(function(success){
			// 			console.log(success)
			// 		}, function(error){
			// 			console.log(error);
			// 		})
			// })
		});

	});

};

routes.createGroupPOST = function(req, res){
	// clean up debugging mechanisms
	var id = req.body.id;
	var name = req.body.first_name;
	if ((isAuthenticated) && (splitwiseApi != null) && (splitwiseApi.isServiceOk())){
		splitwiseApi.createGroup('pizzaOrder/' + name,[{user_id:id}])
			.then(function(group){
				res.send(group);
			});
	}
	else{
		res.redirect('/');
	}
};

routes.addToExistingGroupPOST = function(req, res){
	var newUser = req.body.newCollaborator;
	var existingGroupId = req.body.groupId;
	if ((isAuthenticated) && (splitwiseApi != null) && (splitwiseApi.isServiceOk())){
		splitwiseApi.addUserToGroup(existingGroupId, newUser)
			.then(function(group){
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
};

routes.removeUserPOST = function(req, res){
	var userId = req.body.userid;
	var groupId = req.body.groupid;

	splitwiseApi.removeUserFromGroup(groupId, userId).
		then(function(sucess){
			console.log("User" + req.body.first_name + " " + req.body.last_name + "has been removed from the group" + sucess);
		}, function(errors){
			console.log(errors);
		})
}

module.exports = routes;

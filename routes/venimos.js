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
		sum +=o.price
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

			console.log("Pizza Orders from mongo", pizzaOrders);
			pizzaOrders.forEach(function(order){ 
				splitwiseApi.createExpense({payment : true, cost : costTotal, description: 'pizza order'}, 
					[{user_id : order.splitwiseId, paid_share: 0.00, owed_share: order.price}])
					.then(function(success){ 
						console.log(success)
					}, function(error){ 
						console.log(error); 
					})
			})
		}); 

	}); 

	// splitwiseApi.createExpense({payment : true, cost : 90.78, description: "You know what"}, 
	// 				[{user_id : '3604533', paid_share: 0.00, owed_share: 70.78}])
	// 				.then(function(success){ 
	// 					console.log(success)
	// 				}, function(error){ 
	// 					console.log(error); 
	// 				})

	// https.request('https://secure.splitwise.com/api/v3.0/create_expense', {payment : true, cost : 90.78, description: "You know what"}, 
	// 	[{user_id : 3604533, paid_share: 0.00, owed_share: 70.78}])
	// 	.then(function(success){ 
	// 		console.log(success)
	// 	}, function(error){ 
	// 		console.log(error); 
	// 	})
	// request.post(
	//     'https://secure.splitwise.com/api/v3.0/create_expense',
	//     { form: { expense: {payment : true, cost : 90.78, description: "You know what"}, 
	//     	userShares : [{user_id : 3604533, paid_share: 0.00, owed_share: 70.78}] } },
	//     function (error, response, body) {

	//     	console.log(response); 
	//         if (!error && response.statusCode == 200) {
	//             console.log(body)
	//         }
	//     }
	// );

	// var options = {
	//   hostname: 'https://secure.splitwise.com/api/v3.0/create_expense',
	//   method: 'POST',
	//   headers: {
	//       'Content-Type': 'application/json',
	//   }
	// };
	// var req = http.request(options, function(res) {
	//   console.log('Status: ' + res.statusCode);
	//   console.log('Headers: ' + JSON.stringify(res.headers));
	//   res.setEncoding('utf8');
	//   res.on('data', function (body) {
	//     console.log('Body: ' + body);
	//   });
	// });
	// req.on('error', function(e) {
	//   console.log('problem with request: ' + e.message);
	// });
	// // write data to request body
	// req.write('{"string": "Hello, World"}');
	// req.end();	

	// request({
	//     url:'https://secure.splitwise.com/api/v3.0/create_expense',
	//     method: "POST",
	//     json: true,   // <--Very important!!!
	//     body: myJSONObject
	// }, function (error, response, body){
	//     console.log(response);
	// });

	// request.post({url:'https://secure.splitwise.com/api/v3.0/create_expense', 
	// 	form: {expense: {payment : true, cost : 90.78, description: "You know what"}, 
	// 	userShares : [{user_id : 3604533, paid_share: 0.00, owed_share: 70.78}] }}, 
	// 	function(err,httpResponse,body){ 
	// 		if(err){ 
	// 			console.log(err); 
	// 		}
	// 		console.log(httpResponse); 
	// 		console.log(body); 
	// 	})


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
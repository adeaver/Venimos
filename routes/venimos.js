var express = require('express'); 
var router = express.Router(); 
var mongoose = require('mongoose'); 

var oneOrder = require('../models/individualOrderModel');
var wholeOrder = require('../models/wholeOrderModel');
var oauthIds = require('../oauth'); 
var AuthApi = require('splitwise-node');
routes = {}; 
var authApi = new AuthApi(oauthIds.consumerKey, oauthIds.consumerSecret);

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
	    	console.log("yo"); 
	    	// ({ oAuthToken, oAuthTokenSecret }) => {
	        // [userOAuthToken, userOAuthTokenSecret] = [oAuthToken, oAuthTokenSecret];
	        url = authApi.getUserAuthorisationUrl(options.token);
	        res.send(url);  

	    }, function(err){ 
	    	console.log(err); 
	    });
}; 

routes.addNewOrderPOST = function(req, res){ 
	var iOrder = new oneOrder({name: req.body.name, price: req.body.price, myOrder: req.body.myOrder})
	iOrder.save(function(err){ 
		if(err){ 
			console.log("There has been an error saving your order", err); 
		}
	})

	oneOrder.find({}, function(err, all){ 
		res.send(all); 
	})
};

routes.authenticate= function(req, res){
	console.log("are you in here?")
	// console.log(oauthIds.clientId)
	// Access-Control-Allow-Origin: http:"//connect.stripe.com/oauth/authorize?response_type=code&client_id=" + oauthIds.clientId
	// res.redirect('http://connect.stripe.com/oauth/authorize?response_type=code&client_id=' + oauthIds.clientId);

	// res.setHeader("Access-Control-Allow-Headers", "http://connect.stripe.com/oauth/authorize?response_type=code&client_id=" + oauthIds.clientId);
	
	// res.header("Access-Control-Allow-Origin", "*");
	// res.header("Access-Control-Allow-Headers", "X-Requested-With"); 
	// res.redirect('https://www.facebook.com/'); 

	// res.writeHead(301,
 //  		{Location: 'http://google.com/'}
	// );
	// res.end();
	// res.writeHeader('Access-Control-Allow-Origin", "localhost:3000');
	// Access-Control-Allow-Origin: http://localhost:3000
	res.writeHeader("Access-Control-Allow-Origin : *"); 
	// res.writeHead(302, {Location: "https://reddit.com/"}); 
	// res.end(); 
	res.redirect('https://reddit.com')
}, 

routes.getIdGET = function(req, res){ 
	res.send("https://connect.stripe.com/oauth/authorize?response_type=code&client_id=" + oauthIds.clientId); 
}; 

routes.apiAccess = function(req, res){ 
	var splitwiseApi = authApi.getSplitwiseApi(req.query.oauth_token, req.query.oauth_verifier);  
	splitwiseApi.isServiceOk().then(function(merp){ 
		console.log("success"); 
		res.send("success"); 
	}, function(error){ 
		console.log(error);
		res.send(error);  
	})

}

module.exports = routes; 
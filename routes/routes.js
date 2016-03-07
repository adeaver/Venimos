var express = require('express'); 
var router = express.Router(); 
var mongoose = require('mongoose'); 

var oneOrder = require('../models/individualOrderModel');
var wholeOrder = require('../models/wholeOrderModel');

routes = {}; 

routes.login = function(request, response){ 
	//Input: request, response objects for get request
	//Output: --. renders log in page 
	response.render('login'); 
	
},
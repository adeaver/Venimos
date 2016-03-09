var pizzapi = require('dominos');
var iOrder = require('../models/individualOrderModel.js');
var wOrder = require('../models/wholeOrderModel.js');

var ordering = {};

ordering.createOrder = function(req, res) {
	
}

ordering.addCollaborator = function(req, res) {

}

ordering.getIndividualOrder = function(req, res) {
	var splitwiseId = req.params.splitwise_id;

	iOrder.find({splitwiseId:splitwiseId}, function(err, order) {
		if(err) {
			res.send(500);
		}

		res.send(order);
	});
}

ordering.getWholeOrder = function(req, res) {
	var splitwiseId = req.params.splitwise_id;

	wOrder.find({friendsOrder:{'$in':[splitwiseId]}}, function(err, order) {
		if(err) {
			res.send(500);
		}

		res.send(order);
	});
}
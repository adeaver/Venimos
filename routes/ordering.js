var mongoose = require('mongoose');
var pizzapi = require('dominos');
var iOrder = require('../models/individualOrderModel.js');
var wOrder = require('../models/wholeOrderModel.js');

var ordering = {};

ordering.createOrder = function(req, res) {
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var email = req.body.email;
	var address = req.body.address;

	var splitwiseId = req.body.splitwiseId;
	var storeId = req.body.storeId;
	var friendsOrders = [];

	friendsOrders.push(splitwiseId);

	createdWOrder = new wOrder({
		firstName:firstName,
		lastName:lastName,
		email:email,
		address:address,
		splitwiseId:splitwiseId,
		storeId:storeId,
		friendsOrders:friendsOrders,
		totalPrice:0
	});

	createdWOrder.save(function (err, newOrder) {
		if(err) {
			res.status(500).send('Error creating whole order');
		}

		res.send(newOrder);
	});
}

// NEED TO IMPLEMENT
ordering.addCollaborator = function(req, res) {
	var wOrderId = req.body.orderId;
	var collaboratorSplitwiseId = req.body.collaboratorSplitWiseId;
	var collaboratorName = req.body.collaboratorName;

	// Make sure you can't add a collaborator that's already added
	wOrder.findOneAndUpdate({_id:wOrderId}, {friendsOrders:{$push:collaboratorSplitwiseId}}, {new:true}, function (err, order) {
		if(err) {
			res.status(500).send('Error adding collaborator');
		}

		createIOrder = createIOrderFromWOrder(wOrderId, collaboratorName, collaboratorSplitwiseId);

		createdIOrder.save(function(err, nOrder) {
			if(err) {
				res.status(500).send('Error adding collaborator');
			}

			res.send(nOrder);
		});
	});
}

ordering.createIndividualOrder = function(req, res) {
	var splitwiseId = req.body.splitwiseId;
	var name = req.body.name;
	var wholeOrderId = req.body.wholeOrderId;

	var createdIOrder = new iOrder({
		splitwiseId:splitwiseId,
		name:name,
		wholeOrderId:wholeOrderId,
		myOrder:[],
		price:0
	});

	createdIOrder.save(function(err, order) {
		if(err) {
			res.status(500).send('Error creating new order');
		}

		res.send(order);
	})
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

// WORKS
ordering.getWholeOrder = function(req, res) {
	var splitwiseId = [];
	splitwiseId.push(req.params.splitwise_id);

	wOrder.find({friendsOrders:{'$in':splitwiseId}}, function(err, order) {
		if(err) {
			res.status(500).send('Error getting whole order');
		}

		res.send(order);
	});
}

// Works
ordering.addToOrder = function(req, res) {
	var splitwiseId = req.body.splitwiseId;
	var itemCode = req.body.itemCode;
	var price = req.body.price;
	var quantity = req.body.quantity;
	var toppings = req.body.toppings.split(',');

	var orderObject = {
		code:itemCode,
		price:price,
		quantity:quantity,
		toppings:toppings
	};

	iOrder.findOneAndUpdate({splitwiseId:splitwiseId}, {$push:{myOrder:orderObject}, $inc:{price:price*quantity}}, {new:true}, function(err, order) {
		if(err) {
			res.status(500).send('Error adding to order');
		}

		res.send(order);

	})
}

module.exports = ordering;

function createIOrderFromWOrder(nwOrderId, name, splitwiseId) {
	var createdIOrder = new iOrder({
		splitwiseId:splitwiseId,
		name:name,
		wholeOrderId:nwOrderId,
		myOrder:[],
		price:0
	});

	return createdIOrder;
}
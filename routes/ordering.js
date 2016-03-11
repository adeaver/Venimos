var mongoose = require('mongoose');
var pizzapi = require('dominos');
var hasher = require('crypto');
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

	createdWOrder = {
		firstName:firstName,
		lastName:lastName,
		email:email,
		address:address,
		splitwiseId:splitwiseId,
		storeId:storeId,
		friendsOrders:friendsOrders,
		totalPrice:0
	};

	// This should update
	wOrder.findOneAndUpdate({splitwiseId:splitwiseId}, {$set:createdWOrder}, {upsert:true, new:true}, function (err, order) {
		if(!err) {
			newIOrder = createIndividualOrder(firstName + " " + lastName, splitwiseId, order._id);

			newIOrder.save(function (err, createdIOrder) {
				if(!err) {
					var output = {};

					output.individualOrder = createdIOrder;
					output.wholeOrder = order;

					res.json(output);

				} else {
					res.status(500).json({'message':'failed to add individual order'});
				}
			});
		} else {
			res.status(500).json({'message':'failed to add whole order'});
		}
	});
}

// WORKS
ordering.addCollaborator = function(req, res) {
	var wOrderId = req.body.orderId;
	var collaboratorSplitwiseId = req.body.collaboratorSplitwiseId;
	var collaboratorName = req.body.collaboratorName;

	wOrder.findOneAndUpdate({_id:wOrderId}, {$push:{friendsOrders:collaboratorSplitwiseId}}, {new:true}, function (err, order) {
		if(!err) {
			newIOrder = createIndividualOrder(collaboratorName, collaboratorSplitwiseId, wOrderId);

			newIOrder.save(function (err) {
				if(!err) {
					res.json(order);
				} else {
					res.json({'message':'Error adding individual order'});
				}
			});
		} else {
			res.status(500).json({'message':'Error adding collaborator'});
		}
	});
}

ordering.removeCollaborator = function(req, res) {
	var wOrderId = req.body.orderId;
	var collaboratorSplitwiseId = req.body.collaboratorSplitwiseId;

	wOrder.findOneAndUpdate({_id:wOrderId}, {$pull:{friendsOrders:{$in:[collaboratorSplitwiseId]}}}, {new:true}, function (err, order) {
		if(!err) {
			iOrder.remove({splitwiseId:collaboratorSplitwiseId}, function(err) {
				if(!err) {
					res.json(order);
				} else {
					res.json({'message':'failed to remove collaborator from order'});
				}
			});
		} else {
			res.status(500).json({'message':'Error removing collaborator'});
		}
	});
}

ordering.getOrdersForUser = function(req, res) {
	var splitwiseId = req.params.splitwise_id;

	iOrder.findOne({splitwiseId:splitwiseId}, function (err, findIOrder) {
		if(!err) {
			var splitwiseIds = [splitwiseId];

			wOrder.findOne({friendsOrders:{'$in':splitwiseIds}}, function (err, findWOrder) {
				if(!err) {
					var output = {};

					output.individualOrder = findIOrder;
					output.wholeOrder = findWOrder;

					res.json(output);
				} else {
					res.status(500).json({'message':'Error finding whole order'});
				}
			})
		} else {
			res.status(500).json({'message':'Error finding individual order'});
		}
	})
}

// Works
ordering.addToOrder = function(req, res) {
	var splitwiseId = req.body.splitwiseId;
	var itemCode = req.body.itemCode;
	var price = req.body.price;
	var quantity = req.body.quantity;
	var toppings = req.body.toppings.split(',');

	var date = new Date();

	var itemId = hasher.createHmac('sha256', 'someSecret')
						.update(itemCode + req.body.toppings + String(date.getTime()))
						.digest('hex');

	var orderObject = {
		itemId:itemId,
		code:itemCode,
		price:price,
		quantity:quantity,
		toppings:toppings
	};

	iOrder.findOneAndUpdate({splitwiseId:splitwiseId}, {$push:{myOrder:orderObject}, $inc:{price:price*quantity}}, {new:true}, function(err, order) {
		if(err) {
			res.status(500).send('Error adding to order');
		}

		res.json(order);

	})
}

ordering.removeFromOrder = function(req, res) {
	var splitwiseId = req.params.splitwise_id;
	var itemId = req.params.item_id;
	var price = parseFloat(req.params.price);

	iOrder.findOneAndUpdate({splitwiseId:splitwiseId}, {$pull:{myOrder:{itemId:itemId}}, $inc:{price:-1*price}}, {new:true}, function (err, order) {
		if(!err) {
			res.json(order);
		} else {
			res.status(500).json({'message':'error removing item from order'});
		}
	});
	
}

ordering.finalizeOrder = function(req, res) {
	var wholeOrderId = req.body.wholeOrderId;

	wOrder.findOne({_id:wholeOrderId}, function (err, order) {
		if(!err) {
			var customer = new pizzapi.Customer({
				firstName:order.firstName,
				lastName:order.lastName,
				address:order.address,
				email:order.email
			});

			var dominosOrder = new pizzapi.Order({
				customer:customer,
				storeID:order.storeId,
				deliveryMethod:'Delivery'
			});

			iOrder.find({wholeOrderId:wholeOrderId}, function (err, iOrders) {
				if(!err) {
					for(var index = 0; index < iOrders.length; index++) {
						var myOrder = iOrders[index].myOrder;
						for(var itemIndex = 0; itemIndex < myOrder.length; itemIndex++) {
							var item = myOrder[itemIndex];

							dominosOrder.addItem(new pizzapi.Item(
								{
								code:item.code,
								quantity:item.quantity,
								options:item.toppings
								})
							);
						}
					}

					dominosOrder.validate(function (result) {
						if(result.success) {
							// THIS FUNCTION WOULD PAY FOR THE ORDER IF SUPPLIED CREDIT CARD INFORMATION
							// WE CHOSE NOT TO IMPLEMENT THIS PART
							
							dominosOrder.place(function (placeResult) {
								if(placeResult.success) {
									wOrder.remove({_id:wholeOrderId}, function(err) {
										if(!err) {
											iOrder.remove({wholeOrderId:wholeOrderId}, function(err) {
												if(!err) {
													res.json({'message':'success!'});
												} else {
													res.status(500).json({'message':'Error'});
												}
											});
										} else {
											res.status(500).json({'message':'Could not remove whole order'});
										}
									});
								} else {
									res.status(500).json({'message':'Cannot place order'})
								}
							});
						} else {
							res.status(500).json({'message':'Could not validate order'});
						}
					})
				} else {
					res.status(500).json({'message':'Error finalizing order'});
				}
			});
		} else {
			res.status(500).json({'message':'Error finalizing order'});
		}
	});

}

module.exports = ordering;

var createIndividualOrder = function(name, id, wholeOrderId) {
	return createdIOrder = new iOrder({
		splitwiseId:id,
		name:name,
		wholeOrderId:wholeOrderId,
		myOrder:[],
		price:0
	});
}
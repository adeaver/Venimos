var mongoose = require('mongoose');

var wholeOrderSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	address: String,
	email: String,
	storeId: String,
	splitwiseId:String,
	friendsOrders: [{type:String}]
});

var wholeOrder = mongoose.model('wholeOrders',  wholeOrderSchema);
module.exports = wholeOrder;

// What's the difference between an individual order and a whole order?
// I have a guess, but the words are a little ambiguous... document please :)

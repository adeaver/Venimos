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

// I might just do module.exports = mongoose.model, but that's very nitpicky
var wholeOrder = mongoose.model('wholeOrders',  wholeOrderSchema);
module.exports = wholeOrder;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var individualOrderSchema = mongoose.Schema({
	name: String,
	splitwiseId: String,
	wholeOrderId: String,
	myOrder: {type:Array},
	price: Number
});

// you don't need to give the variable a name -- redundant
module.exports = mongoose.model('individualOrders',  individualOrderSchema);

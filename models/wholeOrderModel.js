var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 

var wholeOrderSchema = mongoose.Schema({ 
	firstName: String,
	lastName: String,
	address: String,
	email: String,
	storeId: String, 
	totalPrice: Number,
	friendsOrders: [{type: Schema.ObjectId, ref: 'friendsOrders'}] 
}, {'collection' : 'wholeOrders'}); 

var wholeOrder = mongoose.model('wholeOrders',  wholeOrderSchema);
module.exports = wholeOrder; 

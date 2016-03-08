var mongoose = require('mongoose'); 

var wholeOrderSchema = mongoose.Schema({ 
	firstName: String,
	lastName: String,
	address: String,
	email: String, 
	totalPrice: Number,
	friends: [{type: Schema.ObjectId, ref: 'friends'}] 
}, {'collection' : 'wholeOrders'}); 

var wholeOrder = mongoose.model('wholeOrders',  wholeOrderSchema);
module.exports = wholeOrder; 

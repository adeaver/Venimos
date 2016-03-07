var mongoose = require('mongoose'); 

var wholeOrderSchema = mongoose.Schema({ 
	mainName: String, 
	totalPrice: Number,
	friends: [{type: Schema.ObjectId, ref: 'friends'}] 
}, {'collection' : 'wholeOrders'}); 

var wholeOrder = mongoose.model('wholeOrders',  wholeOrderSchema);
module.exports = wholeOrder; 

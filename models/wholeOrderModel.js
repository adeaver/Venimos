var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 

var wholeOrderSchema = mongoose.Schema({ 
	mainName: String, 
	totalPrice: Number,
	friendsOrders: [{type: Schema.ObjectId, ref: 'friendsOrders'}] 
}, {'collection' : 'wholeOrders'}); 

var wholeOrder = mongoose.model('wholeOrders',  wholeOrderSchema);
module.exports = wholeOrder; 

var mongoose = require('mongoose'); 

var individualOrderSchema = mongoose.Schema({ 
	name: String,
	wholeOrderId: Number,  
	myOrder: [{type: Schema.ObjectId, ref: 'myOrder'}], 
	price: Number
}, {'collection' : 'wholeOrders'}); 

var individualOrder = mongoose.model('individualOrders',  individualOrderSchema);
module.exports = individualOrder; 

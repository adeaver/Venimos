var mongoose = require('mongoose'); 

var individualOrderSchema = mongoose.Schema({ 
	name: String,
	splitwiseId: String,
	wholeOrderId: Number,  
	myOrder: [{
		quantity:Number,
		id:String,
		price:Number
	}],
	price: Number
}, {'collection' : 'wholeOrders'}); 

var individualOrder = mongoose.model('individualOrders',  individualOrderSchema);
module.exports = individualOrder; 

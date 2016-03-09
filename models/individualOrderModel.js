var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 


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
}); 

var individualOrder = mongoose.model('individualOrders',  individualOrderSchema);
module.exports = individualOrder; 

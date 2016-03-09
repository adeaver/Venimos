var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 


var individualOrderSchema = mongoose.Schema({ 
	name: String,
	splitwiseId: String,
	wholeOrderId: Number,  
	myOrder: [{
		quantity:Number,
		code:String,
		price:Number,
		toppings:{type:Array}
	}],
	price: Number
}); 

var individualOrder = mongoose.model('individualOrders',  individualOrderSchema);
module.exports = individualOrder; 

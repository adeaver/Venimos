var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 


var individualOrderSchema = mongoose.Schema({ 
	name: String,
	splitwiseId: String,
	wholeOrderId: String,  
	myOrder: {type:Array},
	price: Number
}); 

var individualOrder = mongoose.model('individualOrders',  individualOrderSchema);
module.exports = individualOrder; 

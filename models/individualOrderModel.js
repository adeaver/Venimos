var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 


var individualOrderSchema = mongoose.Schema({ 
	name: String,
	wholeOrderId: Number,  
	myOrder: String, 
	price: Number
}, {'collection' : 'wholeOrders'}); 

var individualOrder = mongoose.model('individualOrders',  individualOrderSchema);
module.exports = individualOrder; 

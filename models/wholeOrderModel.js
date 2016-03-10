var mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 

var wholeOrderSchema = new mongoose.Schema({ 
	firstName: String,
	lastName: String,
	address: String,
	email: String,
	storeId: String, 
	splitwiseId:String,
	friendsOrders: [{type:String}] 
}); 

var wholeOrder = mongoose.model('wholeOrders',  wholeOrderSchema);
module.exports = wholeOrder; 

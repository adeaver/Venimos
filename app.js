var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
var AuthApi = require('splitwise-node');
var oauthIds = require('./oauth'); 
var https = require('https'); 

app.use(bodyParser.json() ); 
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));

var pizza = require('./routes/pizza.js');
var ordering = require('./routes/ordering.js');
var venimos = require('./routes/venimos'); 

mongoose.connect('mongodb://pizza:thehutt@ds023478.mlab.com:23478/pizza4all', function(err) {
	if(err) {
		throw err;
	}
});

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

app.get('/', pizza.home);
app.get('/login', venimos.login); 
app.get('/home', venimos.home);
app.get('/order', pizza.order);
app.get('/store/:store_type/:address', pizza.getStores);
app.get('/menu/:store_id', pizza.getStoreMenu);
app.get('/getUser', venimos.getUserGET); 
app.get('/getUserFriends', venimos.getUserFriendsGET)
// app.get('/test', venimos.test); 
app.get('/oauthCallback', venimos.apiAccess); 
app.get('/getExistingGroup', venimos.getGroupGET);

app.get('/getOrdersForUser/:splitwise_id', ordering.getOrdersForUser);

app.post('/createGroup', venimos.createGroupPOST); 
app.post('/createOrder', ordering.createOrder);
app.post('/addToOrder', ordering.addToOrder);
app.post('/addCollaborator', ordering.addCollaborator);
app.post('/removeCollaborator', ordering.removeCollaborator);
app.post('/finalizeOrder', ordering.finalizeOrder);
app.post('/payForBill', venimos.payForBillPOST); 
app.post('/addToExistingGroup', venimos.addToExistingGroupPOST); 

app.listen(3000);
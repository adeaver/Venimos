var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
var AuthApi = require('splitwise-node');
var oauthIds = require('./oauth'); 
var https = require('https'); 

app.use( bodyParser.json() ); 
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));

var pizza = require('./routes/pizza.js');

var venimos = require('./routes/venimos'); 

mongoose.connect('mongodb://pizza:thehutt@ds023478.mlab.com:23478/pizza4all');

app.get('/', pizza.home);
app.get('/login', venimos.login); 
app.get('/home', venimos.home);
app.get('/store/:store_type/:address', pizza.getStores);
app.get('/menu/:store_id', pizza.getStoreMenu);
app.get('/idGET', venimos.getIdGET); 
app.post('/newOrder', venimos.addNewOrderPOST);
app.get('/oauthCallback', venimos.apiAccess)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"


app.listen(3000);
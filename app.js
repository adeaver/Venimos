var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

app.use( bodyParser.json() ); 
app.use(bodyParser.urlencoded({
  extended: true
})); 

app.use(express.static(path.join(__dirname, 'public')));

var pizza = require('./routes/pizza.js');

mongoose.connect('mongodb://pizza:thehutt@ds023478.mlab.com:23478/pizza4all');

app.get('/store/:store_type/:address', pizza.getStores);
app.get('/menu/:store_id', pizza.getStoreMenu);
app.get('/price/:customer_id/:method/:store_id', pizza.getOrderPrice);

app.listen(3000);
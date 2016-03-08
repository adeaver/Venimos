var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var expressSession = require('express-session');
var app = express();
var AuthApi = require('splitwise-node');
var oauthIds = require('./oauth'); 
var https = require('https'); 

app.use( bodyParser.json() ); 
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({secret: "notReallyASecret",
	resave:false,
	saveUninitialized:false}));
app.use(passport.initialize());
app.use(passport.session());

var venimos = require('./routes/venimos'); 

mongoose.connect('mongodb://pizza:thehutt@ds023478.mlab.com:23478/pizza4all');

app.get('/api/', function(req, res){
    res.sendfile('./views/notReallyIndex.html');
});
app.get('/api/login', venimos.login); 
app.get('/api/home', venimos.home);
// app.get('/api/oauth', venimos.authenticate);
app.get('/api/idGET', venimos.getIdGET); 
app.post('/api/newOrder', venimos.addNewOrderPOST);
app.get('/api/oauthCallback', venimos.apiAccess)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
app.listen(3000);
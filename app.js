var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var expressSession = require('express-session');
var app = express();


app.use( bodyParser.json() ); 
app.use(bodyParser.urlencoded({
  extended: true
})); 

// app.engine('handlebars', exphbs({defaultLayout: 'main'}));
// app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({secret: "notReallyASecret",
	resave:false,
	saveUninitialized:false}));
app.use(passport.initialize());
app.use(passport.session());

var venimos = require('./routes/venimos'); 

mongoose.connect('mongodb://pizza:thehutt@ds023478.mlab.com:23478/pizza4all');

// app.get('/api/home', venimos.login);
app.get('/api/', function(req, res){
    res.sendfile('./views/index.html');
});
app.post('/api/newOrder', venimos.addNewOrderPOST);

app.listen(3000);
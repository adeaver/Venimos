var pizzapi = require('dominos');
var http = require('https');
var bl = require('bl');
var path = require('path');
var pizzaParser = require('./pizzaParser.js');

var menuURL = "https://order.dominos.com/power/store/STORE_ID/menu?lang=en&structured=true"

var pizzaRoutes = {};

pizzaRoutes.home = function(req, res) {
	res.sendFile(path.join(__dirname, '../views', 'index.html'));
}

pizzaRoutes.order = function(req, res) {
	res.sendFile(path.join(__dirname, '../views', 'order.html'));
}

pizzaRoutes.getStores = function(req, res) {
	var address = req.params.address;
	var type = req.params.store_type;

	pizzapi.Util.findNearbyStores(address, type, function (store) {
		res.json(store);
	});
};

pizzaRoutes.getStoreMenu = function(req, res) {
	var sendURL = menuURL.replace("STORE_ID", req.params.store_id); // this is clean :)

	http.get(sendURL, function (response) {
		var finalData = '';
		response.setEncoding('utf-8');

		response.on('data', function(data) {
			finalData += data;
		});

		response.on('end', function() {
			var parseData = JSON.parse(finalData);
			var sendData = {}

			sendData.coupons = pizzaParser.objectsToList(parseData.Coupons);
			sendData.products = pizzaParser.parseProducts(pizzaParser.objectsToList(parseData.Products));
			sendData.toppings = pizzaParser.removeSuperKeys(parseData.Toppings);
			sendData.variants = parseData.Variants;

			res.json(sendData);
		});
	});
};

module.exports = pizzaRoutes;

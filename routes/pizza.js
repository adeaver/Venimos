var pizzapi = require('dominos');
var http = require('https');
var bl = require('bl');
var path = require('path');

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
	var sendURL = menuURL.replace("STORE_ID", req.params.store_id);

	http.get(sendURL, function (response) {
		var finalData = '';
		response.setEncoding('utf-8');

		response.on('data', function(data) {
			finalData += data;
		});

		response.on('end', function() {
			var parseData = JSON.parse(finalData);
			var sendData = {}

			sendData.coupons = objectsToList(parseData.Coupons);
			sendData.products = parseProducts(objectsToList(parseData.Products));
			sendData.toppings = parseData.Toppings;
			sendData.variants = parseData.Variants;

			res.json(sendData);
		});
	});
};

function objectsToList(data) {
	var output = [];
	var keyList = Object.keys(data);

	for(var index = 0; index < keyList.length; index++) {
		output.push(data[keyList[index]]);
	}

	return output;
}

function parseProducts(data) {
	var output = {};
	var finalOutput = {};

	for(var index = 0; index < data.length; index++) {
		var productType = data[index].ProductType;

		if(productType in output) {
			output[productType].push(data[index]);
		} else {
			output[productType] = [];
			output[productType].push(data[index]);
		}
	}

	finalOutput.keys = Object.keys(output);
	finalOutput.productInfo = output;

	return finalOutput;
}

module.exports = pizzaRoutes;
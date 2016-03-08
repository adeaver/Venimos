var pizzapi = require('dominos');
var http = require('https');
var bl = require('bl');

var menuURL = "https://order.dominos.com/power/store/STORE_ID/menu?lang=en&structured=true"

var pizzaRoutes = {};

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
			sendData.products = objectsToList(parseData.Products);
			sendData.toppings = objectsToList(parseData.Toppings);
			sendData.variants = objectsToList(parseData.Variants);

			res.json(sendData);
		});
	});
};

pizzaRoutes.getOrderPrice = function(req, res) {
 
	var thePresident = new pizzapi.Customer(
	  {
	      firstName: 'Barack',
	      lastName: 'Obama',
	      address: '700 Pennsylvania Avenue, Washington, DC',
	      email: 'barack@whitehouse.gov'
	  }
	);

	var order = new pizzapi.Order({
		customer:thePresident,
		storeID:req.params.store_id,
		deliveryMethod:req.params.method
	});

	order.addItem(
	  new pizzapi.Item(
	      {
	          code: 'BBOWL',
	          options: [],
	          quantity: 1
	      }
	  )
	);

	  order.price(
	      function(result) {
	          res.send(result);
	      }
	  );
}

function objectsToList(data) {
	var output = [];
	var keyList = Object.keys(data);

	for(var index = 0; index < keyList.length; index++) {
		output.push(data[keyList[index]]);
	}

	return output;
}

module.exports = pizzaRoutes;
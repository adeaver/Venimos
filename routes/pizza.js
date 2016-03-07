var pizzapi = require('dominos');
var http = require('https');
var bl = require('bl');

var menuURL = ["https://order.dominos.com/power/store/", "/menu?lang=en&structured=true"]

var pizzaRoutes = {};

pizzaRoutes.getStores = function(req, res) {
	var address = req.params.address;
	var type = req.params.store_type;

	pizzapi.Util.findNearbyStores(address, type, function (store) {
		res.json(store);
	});
};

pizzaRoutes.getStoreMenu = function(req, res) {
	var sendURL = menuURL[0] + req.params.store_id + menuURL[1];

	console.log(sendURL);

	http.get(sendURL, function (response) {
		response.pipe(bl(function(err, data) {
			var sendData = JSON.parse(data.toString());
			res.json(sendData);
		}));
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

module.exports = pizzaRoutes;
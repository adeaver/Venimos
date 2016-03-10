var app = angular.module('venimos', []);

app.controller('orderController', function ($scope, $http) {
	$scope.order = null;
	$scope.individualOrder = null;
	$scope.lookupAddress = false;
	$scope.isOrderOwner = false;

	$scope.addresses = [];

	$scope.dateNum = new Date().getDay();
	$scope.dates = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
	$scope.date = $scope.dates[$scope.dateNum];

	// Store information keys

	$scope.coupons = null;
	$scope.products = null;
	$scope.productKeys = null;
	$scope.variants = null;
	$scope.toppings = null;

	// Models

	$scope.street = '';
	$scope.city = '';
	$scope.state = '';
	$scope.zip = '';

	$scope.radioOrder = 'model';


	// display variables
	$scope.productKeyToShow = null;
	$scope.productTypeToShow = null;


	// TODO ADD USER INFORMATION HERE
	$scope.splitwiseUser = {
		id:'23456',
		firstName:'William Howard',
		lastName:'Taft',
		email:'imreallyfat@POTUS.gov'
	};

	$scope.splitwiseFriends = [{
		id:'12345',
		firstName:'Millard',
		lastName:'Fillmore',
		email:'millard.fillmore@POTUS.gov'
	}, {
		id:'34567',
		firstName:'Theodore',
		lastName:'Roosevelt',
		email:'teddy@POTUS.gov'
	}];


	$http.get('/wholeOrder/' + $scope.splitwiseUser.id)
		.then(function(response) {
			if(response.data.length > 0) {
				$scope.order = response.data[0];
				$scope.isOrderOwner = $scope.order.splitwiseId == $scope.splitwiseUser.id;
				$scope.getMenu($scope.order.storeId);
			}
		});

	$http.get('/individualOrder/' + $scope.splitwiseUser.id)
		.then(function(response) {
			$scope.individualOrder = response.data[0];
		});

	// Functions

	$scope.searchAddress = function() {
		if($scope.street === '' || $scope.city === '' ||
			$scope.state === '' || $scope.zip === '') {
			alert('You must fill out all of the fields');
		} else {
			var search = $scope.street + ', ' + $scope.city + ', ' + $scope.state + ', ' + $scope.zip;

			$http.get('/store/delivery/' + search)
				.then(function (response) {
					$scope.addresses = response.data.result.Stores;
					$scope.lookupAddress = true;
				});
		}
	}

	$scope.chooseStore = function(id) {
		// This method should create an order

		var address = $scope.street + ', ' + $scope.city + ', ' + $scope.state + ', ' + $scope.zip;

		$http.post('/createOrder/', {
			firstName:$scope.splitwiseUser.firstName,
			lastName:$scope.splitwiseUser.lastName,
			email:$scope.splitwiseUser.email,
			splitwiseId:$scope.splitwiseUser.id,
			address:address,
			storeId:id
		}).then(function (response) {
			$scope.order = response.data;
			$scope.isOrderOwner = true;

			$http.post('/createIndividualOrder', {
				splitwiseId:$scope.splitwiseUser.id,
				wholeOrderId:$scope.order._id,
				name:$scope.splitwiseUser.firstName + " " + $scope.splitwiseUser.lastName
			});
		});
		
		$scope.getMenu(id);
	}

	$scope.selectCoupon = function(code) {
		alert(code);
	}

	$scope.addToOrder = function() {
		// This can be replaced by an directive with querySelector
		var orderRadio = document.getElementsByClassName('orderRadio');
		var orderCheck = document.getElementsByClassName('toppingCheckbox');

		var toppings = [];

		for(var index = 0; index < orderRadio.length; index++) {
			if(orderRadio[index].checked) {
				var orderId = orderRadio[index].value;
				var quantity = document.getElementById('qty_' + orderId).value;
				var price = document.getElementById('price_' + orderId).value;
				break;
			}
		}

		// TODO add quantities for checked ingredients
		for(var index = 0; index < orderCheck.length; index++) {
			if(orderCheck[index].checked) {
				toppings.push(orderCheck[index].value);
			}
		}

		// ADD ITEM TO ORDER
		$http.post('/addToOrder', {
			splitwiseId:$scope.splitwiseUser.id,
			itemCode:orderId,
			price:price,
			quantity:quantity,
			toppings:toppings.join(',')
		}).then(function(response) {
			// This should add something to the current order
			$scope.individualOrder = response.data;
			$scope.productKeyToShow = null;
			$scope.productTypeToShow = null;
			alert('Added to order');
		})
	}

	$scope.addCollaborator = function(first, last, id) {
		var name = first + " " + last;
		
		$http.post('/addCollaborator', {
			collaboratorName:name,
			collaboratorSplitwiseId:id,
			orderId:$scope.order._id
		}).then(function(response) {
			$scope.order = response.data;

			$http.post('/createIndividualOrder', {
				name:name,
				splitwiseId:id,
				wholeOrderId:$scope.order._id
			});
		});
	}

	// Formatting functions

	$scope.couponAvailable = function(dates) {
		return dates.indexOf($scope.date) != -1 || false;
	}


	$scope.checkIsDefault = function(defaultToppings, topping) {
		return defaultToppings.indexOf(topping) != -1 || false;
	}

	$scope.isAlreadyCollaborator = function(id) {
		return $scope.order.friendsOrders.indexOf(id) != -1 || false;
	}

	// Display Functions
	$scope.showProductKey = function(key) {
		$scope.productKeyToShow = key;
		$scope.productTypeToShow = null;
		$scope.toppingsToShow = null;
	}

	$scope.showProductTypes = function(key) {
		$scope.productTypeToShow = key;
		$scope.toppingsToShow = null;
	}

	$scope.showProductToppings = function(key) {
		$scope.toppingsToShow = key;
	}

	// Other functions
	$scope.getMenu = function(id) {
		$http.get('/menu/' + id)
			.then(function(response) {
				$scope.coupons = response.data.coupons;
				$scope.products = response.data.products.productInfo;
				$scope.productKeys = response.data.products.keys;
				$scope.variants = response.data.variants;
				$scope.toppings = response.data.toppings;
			});
	}
});
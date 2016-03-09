var app = angular.module('venimos', []);

app.controller('orderController', function ($scope, $http) {
	$scope.splitwiseUser = null;
	$scope.order = null;
	$scope.lookupAddress = false;

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
	$scope.splitwiseUser = true;


	// Functions

	$scope.searchAddress = function() {
		if($scope.street === '' || $scope.city === '' ||
			$scope.state === '' || $scope.zip === '') {
			alert('You must fill out all of the fields');
		} else {
			var search = $scope.street + ', ' + $scope.city + ', ' + $scope.state + ', ' + $scope.zip;

			$http.get('/store/delivery/' + search)
				.then(function(response) {
					$scope.addresses = response.data.result.Stores;
					$scope.lookupAddress = true;
				});
		}
	}

	$scope.chooseStore = function(id) {
		// This method should create an order
		$scope.order = true;
		
		$http.get('/menu/' + id)
			.then(function(response) {
				$scope.coupons = response.data.coupons;
				$scope.products = response.data.products.productInfo;
				$scope.productKeys = response.data.products.keys;
				$scope.variants = response.data.variants;
				$scope.toppings = response.data.toppings;
			});
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
				var quantity = document.getElementById('qty_' + orderRadio[index].value).value;
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
	}

	// Formatting functions

	$scope.couponAvailable = function(dates) {
		return dates.indexOf($scope.date) != -1 || false;
	}


	$scope.checkIsDefault = function(defaultToppings, topping) {
		return defaultToppings.indexOf(topping) != -1 || false;
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
});
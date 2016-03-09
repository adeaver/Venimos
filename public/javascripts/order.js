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


	// TODO ADD USER INFORMATION HERE
	$scope.splitwiseUser = true;


	// Functions

	$scope.searchAddress = function() {
		if($scope.street === '' || $scope.city === '' ||
			$scope.state === '' || $scope.zip === '') {
			alert('You must fill out all of the fields');
		} else {
			var search = $scope.street + ', ' + $scope.city + ', ' + $scope.state + ', ' + $scope.zip;

			console.log('/store/delivery/' + search);
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

	$scope.addToOrder = function(code, price) {
		alert(code);
	}

	$scope.couponAvailable = function(dates) {
		return dates.indexOf($scope.date) != -1 || false;
	}
});
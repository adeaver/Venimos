var app = angular.module('venimos', []);

app.controller('orderController', function ($scope, $http) {
	$scope.splitwiseUser = null;
	$scope.order = null;
	$scope.lookupAddress = false;

	$scope.addresses = [];

	$scope.coupons = null;
	$scope.products = null;
	$scope.variants = null;
	$scope.toppings = null;

	// Models

	$scope.street = '';
	$scope.city = '';
	$scope.state = '';
	$scope.zip = '';


	// Functions

	$scope.splitwiseSignIn = function() {
		// This should sign the user in and check to see if they're already a part of an existing order
		// This should assign order to them

		$scope.splitwiseUser = true;
	}

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
				$scope.products = response.data.products;
				$scope.variants = response.data.variants;
				$scope.toppings = response.data.toppings;
			});
	}
});
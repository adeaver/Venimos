var app = angular.module('venimos', ['ngMaterial']);

app.controller('orderController', function ($scope, $http, $document) {
	$scope.order = null;
	$scope.individualOrder = null;
	$scope.lookupAddress = false;
	$scope.isOrderOwner = false;
	$scope.groupId = null;

	$scope.addresses = [];

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

	//total
	$scope.total = 0;

	$scope.splitwiseUser = null;

	$scope.collaborators = [];
	$scope.friendsNotAdded = [];

	$scope.charged = false;


	var createGroup = function(user){
		// console.log("id" , mainId);
		$http.post('/createGroup', user)
        //the convention is that promise .thens should be on the same indent level
        .then(function(group){
            $scope.groupId = group.data.id;
        })
	}


	var addToExistingGroup = function(newUser, orderId){
		console.log("in add to existing group")

		$http.post('/addToExistingGroup', {newCollaborator : newUser, groupId : $scope.groupId})
			.then(function(something){
				console.log("group", something);
			})

	}

	var getExistingOrder = function(groupId){
		console.log("IN get exisiting order")
		$http.get('/getExistingGroup', {groupId : $scope.groupId})
			.then(function(something){
				console.log("group", something);
			})
	}

	var getUserFriends = function(){
		$http.get('/getUserFriends')
			.then(function(friends){
				console.log("friends.data", friends.data);
				$scope.splitwiseFriends = friends.data;
				console.log('SPLITWISE FRIENDS', $scope.splitwiseFriends);
				$scope.getSeparateCollaboratorsFromFriends();
			})
	}

	var getOrders = function(user){
		$http.get('/getOrdersForUser/' + user.id)
			.then(function(response) {
				//in here checkif the owner or if collaborator
				if(response.data.individualOrder !== undefined) {
					$scope.order = response.data.wholeOrder;
					$scope.individualOrder = response.data.individualOrder;

					$scope.isOrderOwner = $scope.order.splitwiseId == $scope.splitwiseUser.id;
					$scope.getMenu($scope.order.storeId);
					getUserFriends();
				}
			});
	}

	$http.get('/getUser')
		.then(function(user){
			$scope.splitwiseUser = user.data;

			if($scope.splitwiseUser.id === undefined) {
				window.location.href = '/';
			}

			getOrders($scope.splitwiseUser);
			createGroup($scope.splitwiseUser);

		})

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
			firstName:$scope.splitwiseUser.first_name,
			lastName:$scope.splitwiseUser.last_name,
			email:$scope.splitwiseUser.email,
			splitwiseId:$scope.splitwiseUser.id,
			address:address,
			storeId:id
		}).then(function (response) {
			$scope.order = response.data.wholeOrder;
			$scope.individualOrder = response.data.individualOrder;

			$scope.isOrderOwner = true;
			getUserFriends();
		});

		$scope.getMenu(id);
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
			alert('Added to order');
		});
	}

	$scope.removeFromOrder = function(id, price) {
		$http.delete('/removeFromOrder/' + $scope.splitwiseUser.id + '/' + id + '/' + price)
			.then(function(response) {
				console.log(response);
				$scope.individualOrder = response.data;
			});
	}

	$scope.addCollaborator = function(user) {
		// Should check to make sure that someone doesn't already have an order open
		var name = user.first_name + " " + user.last_name;
		var id = user.id;
		addToExistingGroup(user, $scope.groupId)
		$http.post('/addCollaborator', {
			collaboratorName:name,
			collaboratorSplitwiseId:id,
			orderId:$scope.order._id
		}).then(function (response) {
			$scope.order = response.data;

			$scope.getSeparateCollaboratorsFromFriends();
		});
	}

	$scope.removeCollaborator = function(id) {
		$http.post('/removeCollaborator', {
			orderId:$scope.order._id,
			collaboratorSplitwiseId:id
		}).then(function (response) {
			$scope.order = response.data;

			$scope.getSeparateCollaboratorsFromFriends();
			$scope.removeUserFromGroup(id);
		});
	}

	// Formatting functions

	$scope.checkIsDefault = function(defaultToppings, topping) {
		return defaultToppings.indexOf(topping) != -1 || false;
	}

	$scope.uncheck = function(name) {
		var orderRadio = document.getElementsByClassName('orderRadio');

        // could be a could map or forEach call, I think either would be a bit cleaner
		for(var index = 0; index < orderRadio.length; index++) {
			if(orderRadio[index].name != name) {
				orderRadio[index].checked = false;
			}
		}
	}

	// Display Functions
	$scope.showProductKey = function(key) {
		$scope.productKeyToShow = key;
		$scope.productTypeToShow = null;
		$scope.toppingsToShow = null;
	}

	$scope.showProductTypes = function(key) {
		if($scope.productTypeToShow !== null) {
			// Readd background light up functionality
			var element = angular.element($document[0].querySelector('#product_entry_' + $scope.productTypeToShow));
			element.addClass('entry');
		}
		$scope.productTypeToShow = key;

		// remove background light up functionality
		var newElement = angular.element($document[0].querySelector('#product_entry_' + key));
		newElement.removeClass('entry');

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


	$scope.getSeparateCollaboratorsFromFriends = function() {
		$scope.collaborators = [];
		$scope.friendsNotAdded = [];

		for(var index = 0; index < $scope.splitwiseFriends.length; index++) {
			// console.log($scope.splitwiseFriends)
			if($scope.order.friendsOrders.indexOf(String($scope.splitwiseFriends[index].id)) != -1) {
				$scope.collaborators.push($scope.splitwiseFriends[index]);
			} else {
				$scope.friendsNotAdded.push($scope.splitwiseFriends[index]);
			}
		}
	}

	$scope.payForTotal = function(){
		$scope.charged = true;
		console.log("paying")
		console.log("order id", $scope.order._id)

		$http.post('/finalizeOrder', {wholeOrderId:$scope.order._id})
			.then(function(response) {
				if(response.data.message !== undefined && response.data.message === 'success!') {
					alert('Thank you for placing your order');
					resetVariables();
				}
			});

		// *******THIS IS WHAT THE CODE WOULD LOOK LIKE IF THE API WOULD COOPERATE

		// $http.post('/payForBill/' + $scope.order._id )
		// 	.then(function(response){

		// 	$http.post('/finalizeOrder', {wholeOrderId:$scope.order._id})
		// 		.then(function(response) {
		// 			if(response.data.message !== undefined && response.data.message === 'success!') {
		// 				alert('Thank you for placing your order');
		// 				resetVariables();
		// 			}
		// 		})
		// });
	}

	var resetVariables = function() {
		$scope.order = null;
		$scope.individualOrder = null;
		$scope.lookupAddress = false;
		$scope.isOrderOwner = false;
		$scope.groupId = null;

		$scope.addresses = [];

		// Store information keys

		$scope.coupons = null;
		$scope.products = null;
		$scope.productKeys = null;
		$scope.variants = null;
		$scope.toppings = null;

		// display variables
		$scope.productKeyToShow = null;
		$scope.productTypeToShow = null;

		//total
		$scope.total = 0;

	}

	$scope.removeUserFromGroup = function(userSplitwiseId){
		if (!$scope.charged){
			$http.post('/removeUser', {userid: userSplitwiseId, groupid: $scope.groupId})
				.then(function(response){ })

		}
		else {
			alert("cannot removed, already charged");
		}

	}

});

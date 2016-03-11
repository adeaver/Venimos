var app = angular.module('venimos', []);

app.controller('orderController', function ($scope, $http) {
	$scope.order = null;
	$scope.individualOrder = null;
	$scope.lookupAddress = false;
	$scope.isOrderOwner = false;
	$scope.groupId = null; 

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

	//total 
	$scope.total = 0; 

	$scope.splitwiseUser = null; 

	// TODO ADD USER INFORMATION HERE
	// $scope.splitwiseUser = {
	// 	id:'23456',
	// 	firstName:'William Howard',
	// 	lastName:'Taft',
	// 	email:'imreallyfat@POTUS.gov'
	// };

	// var you = { id: 3000007,
 //  first_name: 'FATTY',
 //  last_name: 'JUST KIDDING',
 //  picture: 
 //   { small: 'https://dx0qysuen8cbs.cloudfront.net/assets/fat_rabbit/avatars/50-a1e7c78c96b64b48f8ffd189d623c58b.png',
 //     medium: 'https://dx0qysuen8cbs.cloudfront.net/assets/fat_rabbit/avatars/100-17010fc5ad055cc69769b9209f95f2c1.png',
 //     large: 'https://dx0qysuen8cbs.cloudfront.net/assets/fat_rabbit/avatars/200-4a03472750dda254b5e7a8e1726bb5d3.png' },
 //  email: 'alvarado.casey@gmail.com',
 //  registration_status: 'confirmed',
 //  force_refresh_at: null,
 //  locale: null,
 //  country_code: 'US',
 //  date_format: 'MM/DD/YYYY',
 //  default_currency: 'USD',
 //  default_group_id: -1,
 //  notifications_read: '2012-07-17T23:54:29Z',
 //  notifications_count: 0,
 //  notifications: 
 //   { added_as_friend: true,
 //     added_to_group: true,
 //     expense_added: false,
 //     expense_updated: false,
 //     bills: true,
 //     payments: true,
 //     monthly_summary: true,
 //     announcements: true } }

	// $scope.splitwiseFriends = [{
	// 	id:'12345',
	// 	firstName:'Millard',
	// 	lastName:'Fillmore',
	// 	email:'millard.fillmore@POTUS.gov'
	// }, {
	// 	id:'34567',
	// 	firstName:'Theodore',
	// 	lastName:'Roosevelt',
	// 	email:'teddy@POTUS.gov'
	// }];
	var createGroup = function(user){ 
		// console.log("id" , mainId); 
		console.log('in createGroup'); 
		$http.post('/createGroup', user)
			.then(function(group){ 
				console.log("group", group); 
				$scope.groupId = group.data.id; 
				console.log("scope.groupId", $scope.groupId)
// 
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
				$scope.splitwiseFriends = friends; 
			})
	}
 
	var getWholeOrder = function(user){ 
		$http.get('/wholeOrder/' + user.id)
			.then(function(response) {
				//in here checkif the owner or if collaborator
				if(response.data.length > 0) {
					console.log("response data", response.data)
					$scope.order = response.data[0];
					$scope.isOrderOwner = $scope.order.splitwiseId == $scope.splitwiseUser.id;
					if($scope.isOrderOwner){ 
						createGroup($scope.splitwiseUser);
					}
					else { 
						addToExistingGroup($scope.splitwiseUser, $scope.orderId); 
					}
					$scope.getMenu($scope.order.storeId);
				}
			});
	}

	var getIndividualOrder = function(user){ 
		$http.get('/individualOrder/' + user.id)
			.then(function(response) {
				$scope.individualOrder = response.data[0];
			});
	}

	$http.get('/getUser')
		.then(function(user){
			// console.log("user id", user.data)
			// $scope.splitwiseId = user.data.id; 
			console.log('CRAP BALLS'); 
			$scope.splitwiseUser = user.data;  
			console.log("$scope.splitwiseUser", $scope.splitwiseUser)
			// createGroup($scope.splitwiseUser);
			console.log('THIS IS THE GROUP ID,', $scope.orderId)
			// addToExistingGroup($scope.splitwiseUser, $scope.orderId);
			// addToExistingGroup(you, $scope.orderId); 
			// getExistingOrder($scope.orderId); 
			// getUserFriends();  
			console.log($scope.splitwiseUser); 
			getWholeOrder($scope.splitwiseUser); 
			getIndividualOrder($scope.splitwiseUser)

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
		console.log('CREATING order, who am I?', $scope.splitwiseUser.first_name); 
		console.log('CREATING order, who am I?', $scope.splitwiseUser.last_name); 
		console.log('CREATING order, who am I?', $scope.splitwiseUser.email); 

		$http.post('/createOrder/', {
			firstName:$scope.splitwiseUser.first_name,
			lastName:$scope.splitwiseUser.last_name,
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
				first_name:$scope.splitwiseUser.first_name, 
				last_name:$scope.splitwiseUser.last_name
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

	$scope.payForTotal = function(){ 
		console.log("paying")
		console.log("order id", $scope.order._id)
		$http.post('/payForBill', {orderId : $scope.order._id})
			.then(function(response){ 

			})
	}

	
});
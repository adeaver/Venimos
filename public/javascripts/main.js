var venimosApp = angular.module('venimosApp', []);

function mainController($scope, $http) {

  $http.get('/api/')
    .success(function(data){
      console.log(data);
    })
    .error(function(data){
      console.log('Error:' + data);
    });

  $scope.saveNewPersonalOrder = function(){ 
    $http.post('/api/newOrder', {name: $scope.personalOrder.name, myOrder : $scope.personalOrder.myOrder, price: $scope.personalOrder.price})
      .success(function(data){ 
        console.log("Success", data);
      })
      .error(function(data){ 
        console.log("Failure", data)
      })

  }

}
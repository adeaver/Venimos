var venimosApp = angular.module('venimosApp', []);

function mainController($scope, $http) {
  $scope.error = false; 
  $scope.pay = false; 

  $http.get('/api/home')
    .success(function(data){
      console.log(data);
    })
    .error(function(data){
      console.log('Error:' + data);
    });

  $scope.saveNewPersonalOrder = function(){ 
    console.log($scope.pay)
    console.log($scope.pay = true)
    $http.post('/api/newOrder', {name: $scope.personalOrder.name, myOrder : $scope.personalOrder.myOrder, price: $scope.personalOrder.price})
      .success(function(data){ 
        console.log("Success", data);
      })
      .error(function(data){ 
        console.log("Failure", data)
      })
  }

  $scope.authenticate = function(){ 
    console.log("Are you in authenticate?")
    $http.get('/api/login')
    .success(function(url){ 
      window.location.href = url;
    })
    .error(function(err){ 
      if(err){ 
        console.log("There has been an error", err); 
      }
    })
    
    // $http.get('/api/idGET')
    //   .success(function(url){ 
    //     window.location.href = url;
    //   })
    //   .error(function(err){ 
    //     if(err){ 
    //       console.log("There has been an error", err); 
    //     }
    //   })
    // $http.get('/api/login')
    //   .success(function(){ 

    //   })
    //   .error(function(){ 

    //   })
  }

} 



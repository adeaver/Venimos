var venimosApp = angular.module('venimosApp', []);

function mainController($scope, $http) {
  $http.get('/api/home')
    .success(function(data){
      console.log(data);
    })
    .error(function(data){
      console.log('Error:' + data);
    });



}

function oauthController($scope, $http){ 

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
    
  }

} 



var venimosApp = angular.module('venimosApp', []);

function oauthController($scope, $http){

    $scope.authenticate = function(){
    console.log("Are you in authenticate?")
    $http.get('/login')
    .success(function(url){
      // should probably remove unused logs
      // console.log("object", object)
      window.location.href = url;
      // console.log("user", object.api.getCurrentUser())
      // window.location.href = "https://secure.splitwise.com/api/v3.0/get_current_user"
    })
    .error(function(err){
      if(err){
        console.log("There has been an error", err);
      }
    })
  }

  // what does thisdo?
  $scope.testFunction= function(){
    $http.get('/getUserFriends')
      .success(function(u){
        console.log(u)
      })
  }
}



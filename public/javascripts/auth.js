var venimosApp = angular.module('venimosApp', []);

function oauthController($scope, $http, $window){

  $scope.authenticate = function(){ // make sure indentation levels match
    $http.get('/login')
    .success(function(url){
      /* Using `$window` instead of `window` makes your code more easily
         testable, because most Angular test frameworks give you infrastructure
         for mocking (creating fake versions of) services, like `$window`, but
         they don't give you ways to provide global variables, like `window`.
      */
      $window.location.href = url;
    })
    .error(function(err){
      if(err){
        console.log("There has been an error", err);
      }
    })
  };
}

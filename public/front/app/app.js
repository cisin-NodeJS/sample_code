var app = angular.module('store', ['ngRoute','ngCart', '__ngCart','uiSlider']);
// configure our routes

app.config(function ($routeProvider) {
    $routeProvider
  // route for the home page
  .when('/', {
      templateUrl: 'template/home.html',
      controller: 'StoreCntrl'
  })
  .when('/login', {
      templateUrl: 'template/users/login.html',
      controller: 'AuthCntroller'
  })
  .when('/registore', {
      templateUrl: 'template/users/sign_up.html',
      controller: 'AuthCntroller'
  })
  .when('/contact', {
      templateUrl: 'template/contact.html',
      controller: 'StoreCntrl'
  })
  .when('/menu', {
      templateUrl: 'template/menu.html',
      controller: 'StoreCntrl'
  })
  .when('/services', {
      templateUrl: 'template/services.html',
      controller: 'StoreCntrl'
  })
  .when('/typo', {
      templateUrl: 'template/typo.html',
      controller: 'StoreCntrl'
  })
  .when('/products', {
      templateUrl: 'template/products/products.html',
      controller: 'ProductsController'
  })
  .when('/product/:pid', {
      templateUrl: 'template/products/single.html',
      controller: 'ProductsController'
  })
  .when('/cart', {
      templateUrl: 'template/products/cart.html',
      controller: 'CartCtrl'
  })
  .when('/contact', {
      templateUrl: 'template/pages/contact.html',
      controller: 'StoreCntrl'
  })
   .when('/myAccount', {
      templateUrl: 'template/pages/my_acount.html',
      controller: 'StoreCntrl'
  })
});



//controller
app.controller('StoreCntrl', ['$scope', '$http','$location','$rootScope', function ($scope, $http,$location,$rootScope) {
  
  $scope.getUserDetails = function () {
    //get user info
    //get localstorage value
$rootScope.getProductsByType();
    var _UserData = localStorage.getItem("userData");
    if ( _UserData != '' && _UserData != undefined) {
      $rootScope.log_status = true;
      var json = JSON.parse(_UserData);
      $scope.UserData = json.UserData;
    } 
    else {
      console.log('No user logged in');
    }
  }
  
  //get my account Orders
  $scope.getMyOrder = function(){
    //call service to get my orders
    if($rootScope.log_status){
    var _UserData = localStorage.getItem("userData");

    var json = JSON.parse(_UserData);
    $scope.UserData = json.UserData;
    $http({
      method: 'GET',
      url: __URL + "/getOrder/" + $scope.UserData._id, 
    }).success(function (data){
        $scope.items = [];
        var k = 0;
        for(var i in data){
          for(var j in data[i].items){
            data[i].items[j].data =  JSON.parse(data[i].items[j].data)
          }
        }
        $scope.order = data;
      })
    }
    else{
      alert('Need to login')
      $location.path('/login');
    }
  }

  $rootScope.getProductsByType = function(){
    $http({
      method: 'GET',
      url: __URL + "/productstype"
    })
    .success(function (data) {
      console.log(data.orderby)
      // var j=0
      // for(var i in data){
      // console.log(data[i].for)
      
      // //   data[j].image.path = 'http://localhost:3001'+ data[i].image.path.slice( 6, data[i].image.path.length )
      // //   data[j].salePrice = parseFloat(data[i].salePrice)
      // //   j++;
      // }
    $rootScope.products = data;
    })
    .error(function (err) {
        alert("error while fetching data");
    })
  }
}]);



 
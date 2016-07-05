/**
 * @Developer : Santosh Kanan
 * @ProductsController: Brand controller for manage brands
 */


/* Setup general page controller */
ShopApp.controller('BrandController', ['$rootScope', '$scope', '$http', '$stateParams','settings','$location', function ($rootScope, $scope, $http, $stateParams, settings, $location ) {
  
  $scope.$on('$viewContentLoaded', function () {
      // initialize core components
      Metronic.initAjax();

      // set default layout mode
      $rootScope.settings.layout.pageBodySolid = false;
      $rootScope.settings.layout.pageSidebarClosed = false;
  });

  $scope.filtered = []
  ,$scope.currentPage = 1
  ,$scope.numPerPage = 5
  ,$scope.maxSize = 50;
  $scope.maxLength = 10;
  $scope.charecter = $scope.maxLength;
  
  /**
   * @method : default brand
   * Descripton : set default values for brand 
   */
  $scope.brandDefault = function () {
    $scope.brand = {};
    $scope.brand.title = '';
    $scope.brand.Description = '';
  }
  
  /**
   * @method : Check
   * Descripton : check charecter left for description
   */
  $scope.check = function(){
    $scope.charecter = $scope.maxLength - $scope.brand.Description.length
    
    if($scope.charecter < 0){
      $scope.charecter = 0;
    }
  }

  /**
   * @method : Add brand
   * Descripton : Add product with cat,  tag,size
   */
  $scope.addbrand = function () {

    $http({
      method: 'POST',
      url: API_URL + "/brand/add",
      data: $scope.brand
    }).success(function (data) {
      if (data.Error) {
          alert(data.Message);//error message
      } else {
        alert('success');
        $location.path('/brands');
      }
    }).error(function (err) {
      alert("error while fetching data");
    });
  }

  /**
   * @method : getAll brand
   * Description : get all brand
   */
  $scope.listbrand  =function (){
    $scope.brands=[];
    $http({
      method : 'GET',
      url : API_URL + "/brand/all"
    }).success(function(data){
      $scope.brands = data;
      $scope.$watch('currentPage + numPerPage', function() {
        var begin = (($scope.currentPage - 1) * $scope.numPerPage)
        , end = begin + $scope.numPerPage;
        $scope.filtered =  $scope.brands.slice(begin, end);
      });
    }).error(function(){
      alert('Error while get data');
    })
  }

  $scope.numPages = function () {
    return Math.ceil($scope.brands.length / $scope.numPerPage);
  };

  /**
  * @delete brand
  * @param {id:number} name description
  */
  $scope.delete = function(id){
    $http({
      method : 'POST',
      url : API_URL + "/brand/delete",
      data : {"_id":id}
    }).success(function(data){
      $( "#"+id ).hide();
      alert('brand has been Deleted !!');
      $location.path('/brands');
      //$scope.products = data;
    }).error(function(){
      alert('Error while Delete data');
    })
  }

  
  /**
  * @edit brand
  * @param {id:number} name description
  */
  $scope.viewBrand = function () { 
    console.log($stateParams.id)
    $http({
      method: 'GET',
      url: API_URL + "/BrandView/"+$stateParams.id
    }).success(function (data) {
      $scope.brand = data[0];
    }).error(function () {
        alert('Error while Delete data');
    })
  }

  /**
  * @method : Edit brand
  * Descripton : Edit product with cat,  tag,size
  */
  $scope.updatebrand = function () {
    var brandsID = $scope.brand._id;
    var brandsData  = $scope.brand;
    delete brandsData['_id'];
    var dd = {
      "_id":brandsID,
      "data" : brandsData
    }
    $http({
      method: 'POST',
      url: API_URL + "/brand/update",
      data: dd
    }).success(function (data) {
      $scope.brand = '';
      $location.path('/brands');
      alert('Updated !!');
    }).error(function (err) {
      console.log(err);
      alert("error while fetching data");
    });
  }

  /**
   * @method : check validation
   * Descripton : check the vallidations on the page
   */
  $scope.checkValidation =function(){
    return (
      $scope.brand.title == '' || 
      $scope.brandForm.title.$touched && $scope.brandForm.title.$invalid
    )
  }
}]);




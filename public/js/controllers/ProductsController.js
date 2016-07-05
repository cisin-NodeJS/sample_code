/**
 * @Developer : Sumit Jaiswal
 * @ProductsController: Product controller for manage products
 */

var c = '';

ShopApp.directive('fileModel', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;
      
      element.bind('change', function(){
        scope.$apply(function(){
          modelSetter(scope, element[0].files[0]);
        });
      });
    }
  };
}]);

ShopApp.directive('ngFiles', ['$parse', function ($parse) {
  function fn_link(scope, element, attrs) {
    var onChange = $parse(attrs.ngFiles);
    element.on('change', function (event) {
      onChange(scope, { $files: event.target.files });
    });
  };

  return {
    link: fn_link
  }
} ])

ShopApp.service('fileUpload', ['$http','$rootScope', function ($http, $rootScope) {
  this.uploadFileToUrl = function(file, uploadUrl){
    var fd = new FormData();
    $rootScope.image = {}
    fd.append('image', file);
    $http.post("http://localhost:3001/uploadSingleFile", fd, {
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    })
    .success(function(data){
    $rootScope.image.name = data.filename;
    $rootScope.image.path = data.path;
    })
    .error(function(){
    });
  }
}]);
////////////////////////////////End file upload ///////////////////

/* Setup general page controller */
ShopApp.controller('ProductsController', ['$rootScope', '$scope', '$http', '$location', '$stateParams', 'settings','fileUpload', function ($rootScope, $scope, $http, $location, $stateParams, settings,fileUpload) {
  $scope.$on('$viewContentLoaded', function () {
    // initialize core components
    Metronic.initAjax();

    // set default layout mode
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
  });

  $scope.filtered = []
  ,$scope.currentPage = 1
  ,$scope.numPerPage = 3
  ,$scope.maxSize = 3;
  $scope.maxLengthshort = 140;
  $scope.maxLength = 500;
  $scope.charecter = $scope.maxLengthshort;
  $scope.subcharecter = $scope.maxLength;

  /**
   * @method : Check
   * Descripton : check charecter left for description
  */
  $scope.check = function(){
    $scope.charecter = $scope.maxLengthshort - $scope.product.shortDescription.length
    if($scope.charecter < 0){
      $scope.charecter = 0;
    }
  }

  $scope.checksub = function(){
    $scope.subcharecter = $scope.maxLength - $scope.product.description.length
    if($scope.subcharecter < 0){
      $scope.subcharecter = 0;
    }
  }

  /**
   * 
   * @return {undefined}
   */
  $scope.productDefault = function () {
    $scope.product = {};
    $scope.product.title = '';
    $scope.product.shortDescription = '';
    $scope.product.description = '';
    $scope.product.category = '';
    $scope.product.category.subcategory = '';
    $scope.product.regularPrice = '';
    $scope.product.salePrice = '';
    $scope.product.sku = '';
    $scope.product.size = '';
    $scope.product.for = '';
     
    $scope.isSubCategory = false;
  }
  
  /**
   * @method : Add Product
   * Descripton : Add product with cat,  tag,size
   */
  $scope.addProduct = function () {
    var data = {};
    
    data = $scope.product;
    
    data.image = $rootScope.image;
    data.otherImage = $scope.otherimage;
    
    $http({
      method: 'POST',
      url: API_URL + "/addProduct",
      data: data
    }).success(function (data) {
      $scope.product = '';
      $location.path('/products');
      alert('Product  added');
    }).error(function (err) {
      console.log(err);
      alert("error while fetching data");
    });
  }
  
  /**
   * @method : getAllProduct
   * Description : get all products
   */
  $scope.products = function () {
    $http({
      method: 'GET',
      url: API_URL + "/allProducts"
    }).success(function (data) {
      $scope.products = data;
      $scope.$watch('currentPage + numPerPage', function() {
        var begin = (($scope.currentPage - 1) * $scope.numPerPage)
        , end = begin + $scope.numPerPage;
        $scope.filtered =  $scope.products.slice(begin, end);
      });
    }).error(function () {
      alert('Error while get data');
    })
  }
  
  $scope.numPages = function () {
    return Math.ceil($scope.products.length / $scope.numPerPage);
  };

  /**
   * @View product
   * @param {id:number} name description
   */
  $scope.viewProduct = function () {
    $http({
      method: 'GET',
      url: API_URL + "/productView/" + $stateParams.id
    }).success(function (data) {
      // console.log(data[0].image.path)
      data[0].image.path = 'http://localhost:3001'+ data[0].image.path.slice( 6, data[0].image.path.length )
      $scope.product = data[0];
      $scope.firstimg = 'http://localhost:3001'+ $scope.product.otherImage[0].path.slice( 6, $scope.product.otherImage[0].path.length ) 
      $scope.secimg = 'http://localhost:3001'+ $scope.product.otherImage[1].path.slice( 6, $scope.product.otherImage[1].path.length )
      $scope.thirdimg = 'http://localhost:3001'+ $scope.product.otherImage[2].path.slice( 6, $scope.product.otherImage[2].path.length )
    }).error(function () {
      alert('Error while Delete data');
    })
  }

  /**
   * @delete product
   * @param {id:number} name description
   */
  $scope.delete = function (id) {
    $http({
      method: 'POST',
      url: API_URL + "/produtDelete",
      data: {"_id": id}
    }).success(function (data) {
      alert('Product has been Deleted !!');
      $("#" + id).hide();
      //$scope.products = data;
    }).error(function () {
      alert('Error while Delete data');
    })
  }

  /**
   * @method : Edit Product
   * Descripton : Edit product with cat,  tag,size
   */
  $scope.editProduct = function () {
    //$scope.product.title;
    var poductID = $scope.product._id;
    var productData = $scope.product;
    productData.image = $rootScope.image;
    productData.otherImage = $scope.otherimage;
    delete productData['_id'];
    var dd = {
      "_id": poductID,
      "data": productData
    }
    $http({
      method: 'POST',
      url: API_URL + "/updateProduct",
      data: dd
    }).success(function (data) {
      $scope.product = '';
      $location.path('/products');
      alert('Updated !!');
    }).error(function (err) {
      console.log(err);
      alert("error while fetching data");
    });
  }

  /**
   * @method : get category
   * Descripton : get the category of the product
   */
  $scope.getCategory = function () {
    $http({
      method: 'GET',
      url: API_URL + "/allcategory"
    }).success(function (data) {
      var result = {};
      angular.forEach(data, function (value, key) {
        if (!value.hasOwnProperty('parent')) {
          result[key] = value;
        }
      });
      $scope.categories = result;
    }).error(function () {
      alert('Error while Delete data');
    })
  }

  /**
   * @method : set category
   * Descripton : set the category of the product and get subcategory if any
   */
  $scope.setcategory = function (id) {
    $http({
      method: 'GET',
      url: API_URL + "/childCategory/" + id
    }).success(function (data) {
      if (data[0].title !=  undefined) {
        $scope.isSubCategory = true;
        $scope.subcategories = data;
      }else{
        $scope.isSubCategory = false;
      }
    }).error(function () {
      alert('Error while Delete data');
    })
  }

  /**
   * @method : get brand
   * Descripton : get the brand for adding the product
   */
  $scope.getBrand = function () {
    $http({
      method: 'GET',
      url: API_URL + "/allbrands"
    }).success(function (data) {
      $scope.brands = data;
    }).error(function () {
      alert('Error while Delete data');
    })
  }
  
  /**
   * @method : upload image 
   * Descripton : upload product image
   */
  $scope.uploadFile = function(){
    var file = $scope.myFile;
    console.log('file is ' );
    console.dir(file);
    var uploadUrl = "/fileUpload";
    fileUpload.uploadFileToUrl(file, uploadUrl);
  };

  /**
   * @method : get files from html page.
   * Descripton :  append multiple image in a file
   */
  $scope.getTheFiles = function ($files) {
    $scope.files = [];
    angular.forEach($files, function(value, key) {
      $scope.files.push(value);
    });
  };

  /**
   * @method : upload multiple image 
   * Descripton : upload multiple product images
   */
  $scope.uploadFiles = function () {
    var formdata = new FormData();
    for(var i in $scope.files){
      formdata.append('images', $scope.files[i]);
    }
    $http.post("http://localhost:3001/uploadMultipleFile", formdata, {
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    }).success(function(data){
      var images = {};
      $scope.otherimage = [];
      for(var i =0;i<data.length;i++){
        images[i]  = { name :data[i].filename , path : data[i].path};
      }
      $scope.otherimage = images;
      
    }).error(function(Err){
      console.log(Err)
    })
  }

  /**
   * @method : check validation
   * Descripton : check the vallidations on the page
   */    
  $scope.checkValidation =function(){
    if($scope.productForm.subcategory){
      return (
        $scope.product.title == '' || $scope.product.salePrice == '' || 
        $scope.product.quantity == '' || $scope.product.sku == '' || 
        $scope.product.category == '' || $scope.product.subcategory == '' ||
        $scope.productForm.title.$touched && $scope.productForm.title.$invalid || 
        $scope.productForm.sku.$touched && $scope.productForm.sku.$invalid || 
        $scope.productForm.quantity.$touched && $scope.productForm.quantity.$invalid || 
        $scope.productForm.category.$touched && $scope.productForm.category.$invalid || 
        $scope.productForm.subcategory.$touched && $scope.productForm.subcategory.$invalid || 
        $scope.productForm.brand.$touched && $scope.productForm.brand.$invalid
      )
    }else{
      return (
        $scope.product.title == '' || $scope.product.salePrice == '' || 
        $scope.product.quantity == '' || $scope.product.sku == '' || 
        $scope.product.category == '' || 
        $scope.productForm.title.$touched && $scope.productForm.title.$invalid || 
        $scope.productForm.sku.$touched && $scope.productForm.sku.$invalid || 
        $scope.productForm.quantity.$touched && $scope.productForm.quantity.$invalid || 
        $scope.productForm.category.$touched && $scope.productForm.category.$invalid || 
        $scope.productForm.brand.$touched && $scope.productForm.brand.$invalid
      )  
    }
  }
        
}]);





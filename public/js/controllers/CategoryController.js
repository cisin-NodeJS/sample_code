ShopApp.controller('CategoryController', ['$rootScope', '$scope', '$http', '$stateParams', 'settings', '$location', function ($rootScope, $scope, $http, $stateParams, settings, $location) {

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
  ,$scope.maxSize = 3;
  $scope.maxLength = 50;
  $scope.charecter = $scope.maxLength;
  $scope.subcategorycharecter = $scope.maxLength;
  $scope.isSubCategory = false;
  
  /**
   * @method : Check
   * Descripton : check charecter left for description
   */
  $scope.check = function(){
    $scope.charecter = $scope.maxLength - $scope.category.Description.length
    if($scope.charecter < 0){
      $scope.charecter = 0;
    }
  }

  /**
   * @method : Check Sub-Category
   * Descripton : check sub-category exist or not
   */
  $scope.checksubcategory = function(){
    $scope.subcategorycharecter = $scope.maxLength - $scope.subcategory.Description.length
    if($scope.subcategorycharecter < 0){
      $scope.subcategorycharecter = 0;
    }
  }

  /**
   * @method : Default category
   * Descripton : Default value of categories
   */
  $scope.categoryDefault = function () {
    $scope.category = {};
    $scope.subcategory = {};
    // $scope.category.subcategory=[];
    $scope.category.title = '';
    $scope.category.Description = '';
  }

  /**
   * @method : Add Category
   * Descripton : Add Category with subcategory
   */
  $scope.addcategory = function (title, desc) {

    // $scope.category.subcategory.push({"title":title,"description":desc})
    var data = {
      cat: $scope.category,
      sub: $scope.subcategory
    };
    $http({
      method: 'POST',
      url: API_URL + "/category/add",
      data: data
    }).success(function (data) {
      if (data.Error) {
        alert(data.Message);//error message
      } else {
        alert('success');
        console.log(data);
        $location.path('/categories');
      }
    }).error(function (err) {
      console.log(err);
      alert("error while add data");
    });
  }

  /**
   * @method : getAll category
   * Description : get all category
   */
  $scope.listcategory = function () {
    $scope.categories=[];
    var k=0;
    $http({
      method: 'GET',
      url: API_URL + "/category/all"
    }).success(function (data) {
      // $scope.categories = data;
      // console.log($scope.categories);
      for(var i in data){
        if(data[i].parent == undefined){
          $scope.categories[k] = data[i];
          k++; 
        }
        else{
          continue
        }
      }
      $scope.$watch('currentPage + numPerPage', function() {
        var begin = (($scope.currentPage - 1) * $scope.numPerPage)
        , end = begin + $scope.numPerPage;
        $scope.filtered =  $scope.categories.slice(begin, end);
      });
    }).error(function () {
        alert('Error while get data');
    })
  }
 
  /**
   * @method : number of pages
   * Description : claculate number of pages required 
   */
  $scope.numPages = function () {
    return Math.ceil($scope.categories.length / $scope.numPerPage);
  };
  
   /**
   * @method : sort
   * Description : sortng categories 
   */
  $scope.sort = function(keyname){
    $scope.sortKey = keyname;   //set the sortKey to the param passed
    $scope.reverse = !$scope.reverse; //if true make it false and vice versa
  }

  /**
   * @delete category
   * @param {id:number} name description
   */
  $scope.delete = function (id) {
    $http({
      method: 'POST',
      url: API_URL + "/category/delete",
      data: {"_id": id}
    }).success(function (data) {
     $("#" + id).hide();
     alert('category has been Deleted !!');
      $location.path('/categories');
      //$scope.products = data;
    }).error(function () {
      alert('Error while Delete data');
    })
  }

  /**
   * @edit category
   * @param {id:number} name description
   */
  $scope.viewCategory = function () {
    $http({
      method: 'GET',
      url: API_URL + "/CategoryView/" + $stateParams.id
    }).success(function (data) {
      $scope.category = data[0];
      $http({
      method: 'GET',
      url: API_URL + "/childCategory/" + data[0]._id
      }).success(function (data) {
      if (data[0].title !=  undefined) {
        $scope.isSubCategory = true;
        $scope.category.subcategories = data[0];
      }else{
        $scope.isSubCategory = false;
      }
    }).error(function () {
      alert('Error while Delete data');
    })
    }).error(function () {
      alert('Error while Delete data');
    })
  }

  /**
   * @method : Edit Product
   * Descripton : Edit product with cat,  tag,size
   */
  $scope.updatecategory = function () {
    var categoryID = $scope.category._id;
    var categoryData = $scope.category;
    console.log(categoryData)
    delete categoryData['_id'];
    var dd = {
      "_id": categoryID,
      "data": categoryData
    }
    $http({
      method: 'POST',
      url: API_URL + "/category/update",
      data: dd
    }).success(function (data) {
      $scope.category = '';
      $location.path('/categories');
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
    if($scope.categoryForm.subTitle){
      return (
        $scope.category.title == '' || 
        $scope.subcategory.title == '' ||
        $scope.categoryForm.title.$touched && $scope.categoryForm.title.$invalid || 
        $scope.categoryForm.subTitle.$touched && $scope.categoryForm.subTitle.$invalid 
      )
    }else{
      return (
        $scope.category.title == '' || 
        $scope.categoryForm.title.$touched && $scope.categoryForm.title.$invalid  
      )  
    }
  }

  

  
}]);
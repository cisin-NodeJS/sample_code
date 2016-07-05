/*
 * Product Controller 
 * this contoller for manage products
 */
app.filter('offset', function () {
    return function (input, start) {
        start = parseInt(start, 10);
        return input.slice(start);
    };
});

app.controller('ProductsController', ['$scope', '$routeParams', '$http', '$location', function ($scope, $routeParams, $http, $location) {
  //controller global variable
  $scope.lower_price_bound = 0;
  $scope.upper_price_bound = 5000;

  $scope.itemsPerPage = 9;
  $scope.currentPage = 0;
  $scope.products = [];
  //create init function for set initial value in contoller
  // $scope.imageURL="http://localhost:3001/uploads/products/1454326291845.jpeg";
  $scope.init = function () {
    //set default values
    $scope.products = {};
  }

  $scope.getProducts = function () {
    $http({
      method: 'GET',
      url: __URL + "/products"
    }).success(function (data) {
      var j=0
      for(var i in data){
        data[j].image.path = 'http://localhost:3001'+ data[i].image.path.slice( 6, data[i].image.path.length )
        data[j].salePrice = parseFloat(data[i].salePrice)
        j++;
      }
      $scope.products = data;
      
    }).error(function (err) {
        alert("error while fetching data");
    });
  }

  /*
   * get product by product ID
   */
  $scope.getProductsByID = function () {
    $('.flexslider').flexslider({
        animation: "slide",
        controlNav: "thumbnails"
    });
    $http({
      method: 'GET',
      url: __URL + "/product/" + $routeParams.pid
    }).success(function (data) {
      $scope.arrayImage=[];
        if (data.Error) {
          alert(data.Message);//error message
          $location.path('/');
        } else {
            data[0].image.path = 'http://localhost:3001'+ data[0].image.path.slice( 6, data[0].image.path.length )
            $scope.product = data[0];
            $scope.imgsrc=data[0].image.path
            $scope.imgsrcmain = data[0].image.path
            $scope.firstimg = 'http://localhost:3001'+ $scope.product.otherImage[0].path.slice( 6, $scope.product.otherImage[0].path.length ) 
            $scope.secimg = 'http://localhost:3001'+ $scope.product.otherImage[1].path.slice( 6, $scope.product.otherImage[1].path.length )
            $scope.thirdimg = 'http://localhost:3001'+ $scope.product.otherImage[2].path.slice( 6, $scope.product.otherImage[2].path.length )
        }
      }).error(function (err) {
          console.log(err);
          alert("error while fetching data");
      });
  }

  $scope.img = function(imagesrc){
    $scope.imgsrc = imagesrc
  }
  
  /*
   * @GetAll Product
   * Description : get all product 
   */
  $scope.getAllProducts = function () {
    $http({
        method: 'GET',
        url: __URL + "/products"
    }).success(function (data) {
        $scope.products = data;
    }).error(function (err) {
        alert("error while fetching data");
    });
  }

  $scope.lowerCase=function(selected){
    if(selected == 'title')
      return 'title';
    else{
      if(selected == 'salePrice')
        return 'salePrice';
    }
  }

  /*
   * get all category
   */
  $scope.getAllCategories = function () {
    $scope.categories = [];
    var j=0;
    $http({
      method: 'GET',
      url: __URL + "/category/all"
    }).success(function (data) {
      for(var i in data){
        if(!data[i].parent){
          $scope.categories[j] = data[i];
          j++
        }
      }
        
    }).error(function (err) {
      alert("error while fetching data");
    });
  }

  /*
   * get all category
   */
  $scope.getProductByCategory = function (catID) {
    $scope.products = [];
    var j=0;
    $http({
      method: 'GET',
      url: __URL + "/productByCategory/" + catID
    }).success(function (data) {
      for(i in data){
        $scope.products[j] = data[i];
        $scope.products[j].image.path = 'http://localhost:3001'+ data[i].image.path.slice( 6, data[i].image.path.length )
        j++
      }
    });
  } 
  /////////////////////////////////////////////////////FOR PAGINATION //////////////////////////////////
  $scope.range = function () {
    var rangeSize = 2;
    var ret = [];
    var start;

    start = $scope.currentPage;
    if (start > $scope.pageCount() - rangeSize) {
      start = $scope.pageCount() - rangeSize + 1;
    }

    for (var i = start; i < start + rangeSize; i++) {
      ret.push(i);
    }
    return ret;
  };

  $scope.prevPage = function () {
    if ($scope.currentPage > 0) {
      $scope.currentPage--;
    }
  };
  $scope.pageCount = function () {
    return Math.ceil($scope.products.length / $scope.itemsPerPage) - 1;
  };
  $scope.prevPageDisabled = function () {

    return $scope.currentPage === 0 ? "disabled" : "";
  };

  $scope.nextPage = function () {
    if ($scope.currentPage < $scope.pageCount()) {
      $scope.currentPage++;
    }
  };

  $scope.nextPageDisabled = function () {
    return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
  };

  $scope.setPage = function (n) {
    $scope.currentPage = n;
  };
  $scope.pageLimit = function (num) {

    $scope.itemsPerPage = num;
  }
  ///////////////////////////////////////////////////////END PAGINATION /////////////////////////////////

  /*
   * price range silder
   */
  $scope.priceRange = function (product) {
    return (parseInt(product['salePrice']) >= $scope.lower_price_bound && parseInt(product['salePrice']) <= $scope.upper_price_bound);
  };
}]);



app.controller('PriceCtrl', function ($scope) {
    $scope.items = [{name: "item 1", "min-acceptable-price": "10",
            "max-acceptable-price": "50"},
        {name: "item 2", "min-acceptable-price": "5",
            "max-acceptable-price": "40"},
        {name: "item 3", "min-acceptable-price": "15",
            "max-acceptable-price": "30"}];

    $scope.lower_price_bound = 0;
    $scope.upper_price_bound = 50;

    $scope.priceRange = function (item) {
        return (parseInt(item['min-acceptable-price']) >= $scope.lower_price_bound && parseInt(item['max-acceptable-price']) <= $scope.upper_price_bound);
    };
});
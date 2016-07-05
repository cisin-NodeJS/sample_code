//controller
app.controller('AuthCntroller', ['$scope', '$http', '$location', '$route','$rootScope' ,function ($scope, $http, $location, $route,$rootScope) {
  //init function for set default value of controller
  $scope.init = function () {
    //set default value
    $rootScope.log_status = false;
    $scope.user = {};
    //define empty value
    $scope.user.user_email = "";
    $scope.user.user_password = "";
    $scope.user.first_name = "";
    $scope.user.last_name = "";
    $scope.user.mobile_no = "";
  }

  /*
   * Method : @SignUp
   * funciton for registore users
   */
  $scope.SignUp = function () {
    $scope.getUser();
    //POST user info
    $http({
      method: 'POST',
      url: __URL + "/users",
      data: $scope.user
    }).success(function (data) {
      if (data.Error) {
        alert('Error while adding user');
      } else {
        //whith data success retuned call or callback
        $scope.user = {};
        $scope.reg_status = 'success';
      }
    }).error(function () {
      $scope.reg_status = 'error';
      //error function
    });
  }
  /*
   * Method :@Login
   * 
   */
  $scope.login = function () {
    if ($scope.user.user_email !== '' && $scope.user.user_password) {
        var _data = {};
        _data.user_email = $scope.user.user_email;
        _data.user_password = $scope.user.user_password;
        $http({
          method: 'POST',
          url: __URL + "/login",
          data: _data,
        }).success(function (data) {
          if (data.Error) {
            alert("wrong username password !!");
            console.log(data);
          } 
          else {
            localStorage.setItem('userData', JSON.stringify(data));
            $location.path("/");
          }
         //store user info in localstorage
        }).error(function () {
      })
    } else {
      alert('Email an Password required !!!');
    }
  }
  /*
   *@method : Logout
   *logout user 
   */
  $scope.logout = function () {
    //delete localstorage
 localStorage.setItem('userData','');
    $rootScope.log_status = false;
    $location.path('/');
  }

  /*
   * 
   */
  $scope.getUser = function () {
    $http({
      method: 'GET',
      url: __URL + '/users'
    }).success(function (data) {
      // With the data succesfully returned, call our callback
      //console.log(JSON.stringify(data));
      $scope.UserDetails = data.postss;
    }).error(function () {
      alert("error while fetching data");
    });
  }
  //testing funciton 
  $scope.testing = function () {
    var userData = {
      "user_email": $scope.user.user_email,
      "user_password": $scope.user.user_password,
      "first_name": $scope.user.first_name,
      "last_name": $scope.user.last_name,
      "mobile_no": $scope.user.mobile_no
    };
    //PSOT user info
    $http({
      method: 'POST',
      url: __URL + "/users",
      data: userData
    }).success(function (data) {
        if (data.Error) {
          alert('Error while adding user');
        } else {
          //whith data success retuned call or callback
          $scope.user = {};
          $scope.reg_status = 'success';
        }
    }).error(function () {
      $scope.reg_status = 'error';
      //error function
    });
  }
}]);
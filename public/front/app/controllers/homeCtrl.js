//controller
app.controller('HomeCntroller', ['$scope', '$http', function ($scope, $http) {
        $scope.getUser = function () {
            $http({
                method: 'GET',
                url: 'http://localhost:8082/api/users'
            }).success(function (data) {
                // With the data succesfully returned, call our callback
                //console.log(JSON.stringify(data));
                $scope.UserDetails = data.postss;
            }).error(function () {
                alert("error while fetching data");
            });
        }
    }]);
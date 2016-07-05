/*
 * __ngCart Module for catr
 * this module basically used for cat of product
 */
var __ngCart = angular.module('__ngCart', ['ngCart']);

__ngCart.controller('CartCtrl', ['$scope', '$http', 'ngCart', function ($scope, $http, ngCart) {
        ngCart.setTaxRate(14.5);
        ngCart.setShipping(0);
    }]);
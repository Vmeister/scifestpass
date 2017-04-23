angular.module('starter.controllers', [])

.controller('BarcodeCtrl', function($scope, $http, $httpParamSerializer, $cordovaBarcodeScanner) {
    $scope.data = "";

    var req = {
    	method: 'POST',
    	url: 'http://46.101.155.94/api/scifest_pass_qr_get/',
    	transformRequest: $httpParamSerializer,
    	headers: {'Content-Type' : 'application/x-www-form-urlencoded'},
    	data: $scope.data
    }

    $scope.readQR = function() {
      $cordovaBarcodeScanner.scan().then(function(barcodeData) {
      	$scope.data = barcodeData;
      }, function(err) {
        $scope.data = err;
      });
    }
})

.controller('WorkshopsCtrl', function($scope, $http, $httpParamSerializer) {
  $scope.workshops = [];

  var req = {
    method: 'POST',
    url: "http://46.101.155.94/api/get_workshops/",
    transformRequest:  $httpParamSerializer,
    headers: {'Content-Type' : 'application/x-www-form-urlencoded'},
    data: {scifest_id: 10},
  }

  $http(req).success(function(data) {
    for(i = 0; i < data.data.length; i++) {
      $scope.workshops.push(data.data[i]);
    }
  }).
  error(function(data) {
    $scope.workshops = data;
  });

  $scope.workshops.push("Testi 1", "Testi 2");

  $scope.showWorshopData = function(workshop) {
  	alert(workshop);
  }
})

.controller('SummaryCtrl', function($scope) {

})
angular.module('starter.controllers', [])

.controller('BarcodeCtrl', function($scope, $http, $httpParamSerializer, $cordovaBarcodeScanner) {
    $scope.title = "";
    $scope.content = "";
    $scope.answer = "";
    $scope.qrRead = false;

    var req = {
    	method: 'POST',
    	url: 'http://46.101.155.94/api/scifest_pass_qr_get/',
    	transformRequest: $httpParamSerializer,
    	headers: {'Content-Type' : 'application/x-www-form-urlencoded'},
    	data: null
    }

    $scope.readQR = function() {
      $cordovaBarcodeScanner.scan().then(function(barcodeData) {
      	req.data = {pass_qr : barcodeData.text};

        $http(req).success(function(data) {
          createAssignment(data);
        })
        .error(function(data) {
          alert("QR-koodin lukeminen epäonnistui. Yritä uudelleen");
        })

      }, function(err) {
         alert("QR-koodin lukeminen epäonnistui. Yritä uudelleen")
      });
    }

    var createAssignment = function(data) {
       $scope.qrRead = true;
       $scope.title = data.data.title;
       $scope.content = data.data.content;
       //data.data.type = tehtävätyyppi jolloin $scope.answer sen mukaiseksi?
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
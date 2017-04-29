angular.module('starter.controllers', [])

.controller('BarcodeCtrl', function($scope, $http, $httpParamSerializer, $cordovaBarcodeScanner, APIURL) {
    $scope.title = "";
    $scope.content = "";
    $scope.answer = "";
    $scope.qrRead = false;
    $scope.isOpenQuestion = false;
    $scope.isMultipleChoice = false;
    $scope.openAnswer = "";
    $scope.multipleChoices = [];

    var req = {
    	method: 'POST',
    	url: APIURL + 'scifest_pass_qr_get/',
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
       if(data.data.type == 0) {
          $scope.isOpenQuestion = true;
       }
       else if(data.data.type == 1) {
        $scope.isMultipleChoice = true;
        var assignment = JSON.parse(data.data.content);
          for(i = 0; i < assignment.data.length; i++) {
            $scope.multipleChoices[i] =
                {
                  question: assignment.data[i][0],
                  options: []
              };
            for(j = 0; j < assignment.data[i].length-1; j++) {
                $scope.multipleChoices[i].options[j] = assignment.data[i][j+1];
            }
          }
       }
    }
})

.controller('WorkshopsCtrl', function($scope, $http, $httpParamSerializer, $localstorage, APIURL) {
  $scope.workshops = [];

  //$localstorage.setObject('id',213);

  //$localstorage.getObject('id')

  var req = {
    method: 'POST',
    url: APIURL + "get_workshops/",
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

  $scope.showWorshopData = function(workshop) {
  	alert(JSON.stringify(workshop));
  }
})

.controller('QRDebugCtrl', function($scope, $http, $httpParamSerializer, $cordovaBarcodeScanner, APIURL) {
  $scope.qrdata = "";
  $scope.JSON = "";

    var req = {
      method: 'POST',
      url: APIURL + 'scifest_pass_qr_get/',
      transformRequest: $httpParamSerializer,
      headers: {'Content-Type' : 'application/x-www-form-urlencoded'},
      data: null
    }

     $scope.readQR = function() {
      $cordovaBarcodeScanner.scan().then(function(barcodeData) {
        req.data = {pass_qr : barcodeData.text};

        $http(req).success(function(data) {
          $scope.JSON = data;
        })
        .error(function(data) {
          alert("QR-koodin lukeminen epäonnistui. Yritä uudelleen");
        })

      }, function(err) {
         alert("QR-koodin lukeminen epäonnistui. Yritä uudelleen")
      });
    }

})

.controller('SummaryCtrl', function($scope) {
  var assignment = {
    title: "kakka",
    answer: "homo"
  }
  $scope.unansweredAssignments = [assignment];
  $scope.answeredAssignments = [assignment];

})

angular.module('starter.controllers', [])

.controller('BarcodeCtrl', function($scope, $http, $httpParamSerializer, $cordovaBarcodeScanner, APIURL, GET_ASSIGNMENT) {
    $scope.title = "";
    $scope.content = "";
    $scope.answer = "";
    $scope.qrRead = false;
    $scope.isOpenQuestion = false;
    $scope.isMultipleChoice = false;
    $scope.openAnswer = "";
    $scope.questions = [];

    var req = {
    	method: 'POST',
    	url: APIURL + GET_ASSIGNMENT,
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
        $scope.isOpenQuestion = false;
        $scope.isSingleChoice = false;
        var multipleChoice = JSON.parse(data.data.content);
          for(i = 0; i < multipleChoice.data.length; i++) {
            $scope.questions[i] =
                {
                  "question": multipleChoice.data[i][0],
                  "options": [],
                  "answers": []
              };
            for(j = 0; j < multipleChoice.data[i].length-1; j++) {
                $scope.questions[i].options[j] = {
                  "option": multipleChoice.data[i][j+1],
                  "selected": false
                }
            }
          }
       }
       else if(data.data.type == 2) {
        $scope.isSingleChoice = true;
        $scope.isMultipleChoice = false;
        $scope.isOpenQuestion = false;
        var singleChoice = JSON.parse(data.data.content);
          for(i = 0; i < singleChoice.data.length; i++) {
            $scope.questions[i] =
                {
                  "question": singleChoice.data[i][0],
                  "options": [],
                  "answer": null
              };
            for(j = 0; j < singleChoice.data[i].length-1; j++) {
                $scope.questions[i].options[j] = singleChoice.data[i][j+1];
            }
          }
       }
    }

    $scope.saveAnswer = function() {
      //toiminnallisuutta
    }

    $scope.cancelAssignment = function() {
      clearAssignment();
    }

    var clearAssignment = function() {
    $scope.title = "";
    $scope.content = "";
    $scope.answer = "";
    $scope.qrRead = false;
    $scope.isOpenQuestion = false;
    $scope.isMultipleChoice = false;
    $scope.openAnswer = "";
    $scope.questions = [];
    }

    $scope.select = function(question, choice) {
      for(i = 0; i < $scope.questions.length; i++)
        if($scope.questions[i].question == question) {
          for(j = 0; j < $scope.questions[i].options.length; j++)
            if($scope.questions[i].options[j].option == choice) {
              if($scope.questions[i].options[j].selected == false) {
                $scope.questions[i].options[j].selected = true;
                $scope.questons[i].answers.push[choice];
              }
              else {
                $scope.questions[i].options[j].selected = false;
                var index = $scope.questions[i].answers.indexOf(choice);
                $scope.questons[i].answers.splice(index, 1);
              } 
            }          
        }
    }
})

.controller('WorkshopsCtrl', function($scope, $http, $httpParamSerializer, $localstorage, APIURL, GET_WORKSHOPS) {
  $scope.workshops = [];

  //$localstorage.setObject('id',213);

  //$localstorage.getObject('id')

  var req = {
    method: 'POST',
    url: APIURL + GET_WORKSHOPS,
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

.controller('QRDebugCtrl', function($scope, $http, $httpParamSerializer, $cordovaBarcodeScanner, APIURL, GET_ASSIGNMENT) {
  $scope.qrdata = "";
  $scope.JSON = "";

    var req = {
      method: 'POST',
      url: APIURL + GET_ASSIGNMENT,
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
    title: "Testi",
    answer: "Tehtävä"
  }
  $scope.unansweredAssignments = [assignment];
  $scope.answeredAssignments = [assignment];

})

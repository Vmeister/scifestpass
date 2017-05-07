angular.module('starter.controllers', [])

.controller('BarcodeCtrl', function($scope, $http, $httpParamSerializer, $cordovaBarcodeScanner, APIURL, GET_ASSIGNMENT, CHECK_ASSIGNMENT, $localstorage) {
    $scope.title = "";
    $scope.content = "";
    $scope.qrRead = false;
    $scope.isOpenQuestion = false;
    $scope.isMultipleChoice = false;
    $scope.openAnswer = {
      answer: ""
    }
    $scope.questions = [];
    $scope.id = null;

    $scope.questionStorage = {
      type: null,
      title: null,
      data: null
    }


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
       $scope.id = data.data.id;
       if(data.data.type == 0) {
          $scope.isOpenQuestion = true;
       }
       else if(data.data.type == 1) {
        $scope.isMultipleChoice =false;
        $scope.isOpenQuestion = false;
        $scope.isSingleChoice = true;
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
        $scope.isSingleChoice = false;
        $scope.isMultipleChoice = true;
        $scope.isOpenQuestion = false;
        var singleChoice = JSON.parse(data.data.content);
          for(i = 0; i < singleChoice.data.length; i++) {
            $scope.questions[i] =
                {
                  "question": singleChoice.data[i][0],
                  "options": [],
                  "answers": []
              };
            $scope.answers[i].question = $scope.questions[i].question;
            for(j = 0; j < multipleChoice.data[i].length-1; j++) {
                $scope.questions[i].options[j] = {
                  "option": multipleChoice.data[i][j+1],
                  "selected": false
                }
            }
          }
       }
    }

    $scope.saveAnswer = function() {
      if($scope.isOpenQuestion) {
        $scope.questionStorage.type = 0;
        $scope.questionStorage.title = $scope.title;
        $scope.questionStorage.data = $scope.content;
        $scope.questionStorage.answer = $scope.openAnswer.answer;
      }
      else {
        $scope.questionStorage.title = $scope.title;
        $scope.questionStorage.data = $scope.questions;
        if($scope.isSingleChoice)
          $scope.questionStorage.type = 2;
        else $scope.questionStorage.type = 1;

      }
      $localstorage.setObject($scope.id, $scope.questionStorage);
      clearAssignment();
    }

    $scope.checkAnswer = function() {
      var req = {
        method: 'POST',
        url: APIURL + CHECK_ASSIGNMENT,
        transformRequest: $httpParamSerializer,
        headers: {'Content-Type' : 'application/x-www-form-urlencoded'},
        data: null
      }

      $cordovaBarcodeScanner.scan().then(function(barcodeData) {
        req.data = {pass_qr : barcodeData.text};

        $http(req).success(function(data) {
          if(data.data == "ok") {
            $scope.saveAnswer();
            alert("Vastaus checkattu pajalla");
            clearAssignment();
          }
        })
        .error(function(data) {
          alert("QR-koodin lukeminen epäonnistui. Yritä uudelleen");
        })

      }, function(err) {
         alert("QR-koodin lukeminen epäonnistui. Yritä uudelleen")
      });

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
    $scope.openAnswer.answer = "";
    $scope.questions = [];
    $scope.questionStorage.title = null;
    $scope.questionStorage.question = null;
    $scope.questionStorage.answer = null;
    }

    $scope.select = function(question, choice) {
      for(i = 0; i < $scope.questions.length; i++)
        if($scope.questions[i].question == question) {
          for(j = 0; j < $scope.questions[i].options.length; j++)
            if($scope.questions[i].options[j].option == choice) {
              if($scope.questions[i].options[j].selected == false) {
                if($scope.isMultipleChoice) {
                  $scope.questions[i].options[j].selected = true;
                  if($scope.questions[i].answers.indexOf(choice) == -1)
                    $scope.questions[i].answers.push(choice);
                } else {
                   if($scope.questions[i].answers.indexOf(choice) == -1) {
                    $scope.questions[i].answers = [choice];
                    for(k = 0; k < $scope.questions[i].options.length; k++)
                      if($scope.questions[i].options[k].option !== choice)
                        $scope.questions[i].options[k].selected = false;
                      else $scope.questions[i].options[k].selected = true;
                   }
                }
              }
              else {
                $scope.questions[i].options[j].selected = false;
                var index = $scope.questions[i].answers.indexOf(choice);
                $scope.questions[i].answers.splice(index, 1);
              } 
            }          
        }
    }
})

.controller('WorkshopsCtrl', function($scope, $http, $httpParamSerializer, $localstorage, APIURL, GET_WORKSHOPS) {
  $scope.workshops = [];

  //$localstorage.setObject('id',213);

  //$localstorage.getObject('id')

  $scope.toggleWorkshop = function(workshop) {
    if($scope.isClicked(workshop)) {
      $scope.shownWorkshop = null;
    } else $scope.shownWorkshop = workshop;
  };

  $scope.isClicked = function(workshop) {
    return $scope.shownWorkshop === workshop;
  };

  var req = {
    method: 'POST',
    url: APIURL + GET_WORKSHOPS,
    transformRequest:  $httpParamSerializer,
    headers: {'Content-Type' : 'application/x-www-form-urlencoded'},
    data: {scifest_id: 10},
  }

  $http(req).success(function(data) {
    for(i = 0; i < data.data.length; i++) {
      var workshop = {
        name : data.data[i].name + " (" + data.data[i].name_en +")",
        subjects : "",
        description : data.data[i].desc,
        group_size: data.data[i].group_size,
        host_organization: data.data[i].host_organization,
        targetgroup: null
      }
      for(j = 0; j < data.data[i].subjects.length; j++) {
        workshop.subjects = workshop.subjects + data.data[i].subjects[j].name;
        if(j !=data.data[i].subjects.length-1)
          workshop.subjects = workshop.subjects + ", ";
      }
      $scope.workshops.push(workshop);
    }
  }).
  error(function(data) {
    $scope.workshops = data;
  });

})

.controller('QRDebugCtrl', function($scope, $http, $httpParamSerializer, $cordovaBarcodeScanner, APIURL, GET_ASSIGNMENT,
  CHECK_ASSIGNMENT) {
  $scope.qrdata = "";
  $scope.JSON = "";

    var req = {
      method: 'POST',
      url: APIURL + CHECK_ASSIGNMENT,
      transformRequest: $httpParamSerializer,
      headers: {'Content-Type' : 'application/x-www-form-urlencoded'},
      data: null
    }

     $scope.readQR = function() {
      $cordovaBarcodeScanner.scan().then(function(barcodeData) {
        req.data = {pass_qr : barcodeData.text};
        $scope.qrdata = barcodeData;
        alert(JSON.stringify(req.data));
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

.controller('SummaryCtrl', function($scope, $localstorage) {
  $scope.answeredQuestions = [];
  $scope.debug = "";
  var answered = $localstorage.getAll();
  for(i = 0; i < answered.length; i++) {
    var question = JSON.parse(answered[i]);
    if(question.type == 0) {
      var answeredQuestion = {
        title: question.title,
        text: "Kysymys: " + question.data + "<br>" + "Vastaus: " + question.answer
      }
      $scope.answeredQuestions.push(answeredQuestion);
    }
    else {
      var answeredQuestion = {
        title: question.title,
        text: ""
      }
      for(j = 0; j < question.data.length; j++) {
        answeredQuestion.text =  answeredQuestion.text + "Kysymys: " + question.data[j].question +
         "<br>" + "Vastaukset: " + question.data[j].answers + "<br>";
      }
      $scope.answeredQuestions.push(answeredQuestion);
    }
  }
})

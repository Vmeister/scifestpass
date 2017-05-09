angular.module('starter.controllers', [])

.controller('BarcodeCtrl', function($scope, $http, $httpParamSerializer, $cordovaBarcodeScanner, APIURL, GET_ASSIGNMENT, CHECK_ASSIGNMENT, $localstorage) {
    $scope.id = null;
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
      id: null,
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
        var singleChoice = {
          "data": [JSON.parse(data.data.content)]
        }
        for(i = 0; i < singleChoice.data.length; i++) {
            $scope.questions[i] =
                {
                  "question": singleChoice.data[i][0],
                  "options": [],
                  "answers": []
              };
            for(j = 0; j < singleChoice.data[i].length-1; j++) {
                $scope.questions[i].options[j] = {
                  "option": singleChoice.data[i][j+1],
                  "selected": false
                }
            }
          }
       }
    }

    $scope.saveAnswer = function() {
      $scope.questionStorage.id = $scope.id;
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
  var workshopsFromStorage = $localstorage.getStatic(20000);

  //$localstorage.setObject('id',213);

  //$localstorage.getObject('id')

  $scope.toggleWorkshop = function(workshop) {
    if($scope.isClicked(workshop)) {
      $scope.shownWorkshop = null;
    } else  {
      $scope.shownWorkshop = workshop;
    }
  };

  $scope.isClicked = function(workshop) {
    return $scope.shownWorkshop === workshop;
  };
  if(workshopsFromStorage == undefined) {
    $scope.questions = [];
    var req = {
      method: 'POST',
      url: APIURL + GET_WORKSHOPS,
      transformRequest:  $httpParamSerializer,
      headers: {'Content-Type' : 'application/x-www-form-urlencoded'},
      data: {scifest_id: 10}
    }

    $http(req).success(function(data) {
      for(i = 0; i < data.data.length; i++) {
        var workshop = {
          name : data.data[i].name,
          description : data.data[i].desc
        }
        $scope.workshops.push(workshop);
      }
      $localstorage.setStatic(20000, $scope.workshops);
    })
  }else {
    $scope.workshops = [];
    var workshopJSON = JSON.parse($localstorage.getStatic(20000));
    for(i = 0; i < workshopJSON.data.length; i++) {
          $scope.workshops.push(workshopJSON.data[i]);
    }
  }
})

.controller('SummaryCtrl', function($scope, $localstorage) {
  $scope.answeredQuestions = [];
  $scope.debug = "";
  $scope.hasAnswered = false;
  var answered = $localstorage.getAll();
  if(answered.length > 0) {
    $scope.hasAnswered = true;
  }
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
         "<br>" + "Vastaukset: " + question.data[j].answers + "<br><br>";
      }
      $scope.answeredQuestions.push(answeredQuestion);
    }
  }
})

.controller("QuestionsController", function($scope, $localstorage, $http, $httpParamSerializer, $rootScope, $stateParams, APIURL, GET_SCIFESTPASS) {
  $scope.questions = [];
  var questionsFromStorage = $localstorage.getStatic(10000);
  var req = {
    method: 'POST',
    url: APIURL + GET_SCIFESTPASS,
    transformRequest:  $httpParamSerializer,
    headers: {'Content-Type' : 'application/x-www-form-urlencoded'},
    data: {scifest_id: 10},
  }
  if(questionsFromStorage == undefined) {
    $scope.questions = [];
    $http(req).success(function(data) {
      for(i = 0; i < data.data.length; i++) {
        var question = {
          id: data.data[i].id,
          type: data.data[i].type,
          title: data.data[i].title,
          question: "",
          solved: false
        }
        if(question.type == 0) {
          question.question = data.data[i].content;
        }
        else if(question.type != 0) {
          if(question.type == 1) {
            var parsedData = JSON.parse(data.data[i].content);
            question.question = parsedData.data[0][0];
          }
          else if(question.type == 2) {
            var dataList = JSON.parse(data.data[i].content);
            question.question = dataList[0];
          }
        }
        $scope.questions.push(question);
      }
      var savedQuestions = $localstorage.getAll();
        for(j = 0; j < savedQuestions.length; j++) {
          var savedQuestion = JSON.parse(savedQuestions[j]);
          if(savedQuestion.id == question.id)
            question.solved=true;
        }
      $localstorage.setStatic(10000, $scope.questions);
    })
  } else {
    $scope.questions = [];
    var questionJSON = JSON.parse($localstorage.getStatic(10000));
    var savedQuestions = $localstorage.getAll();
    for(i = 0; i < questionJSON.data.length; i++) {
         for(j = 0; j < savedQuestions.length; j++) {
            var savedQuestion = JSON.parse(savedQuestions[j]);
            if(savedQuestion.id == questionJSON.data[i].id)
              questionJSON.data[i].solved=true;
          }
          $scope.questions.push(questionJSON.data[i]);
    }
  }


  $scope.isSolved = function(question) {
    return question.solved;
  }

})

.controller('MenuCtrl', function($scope, $rootScope, $stateParams, $state) {
  $scope.help = function() {
    var currentState = $state.current.name;
    if(currentState === "app.workshops")
      alert("Pajat-näkymä sisältää tietoja tämän vuoden SciFest-pajoista Saat lisätietoa pajasta klikkaamalla sen nimeä.");
    else if(currentState === "app.qrcode")
      alert("Tehtävät-näkymässä voit lukea QR-koodeja ja vastata koodilla saatuihin tehtäviin.");
    else if(currentState === "app.summary")
      alert("Yhteenveto-näkymässä voit tarkastella suoritettuja tehtäviäsi.");
    else if(currentState === "app.about") alert("Sovelluksen tietoja.");
    else alert("Sovelluksen etusivu.");
  }

})

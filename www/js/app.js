// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'ngStorage'])

.value('APIURL','http://46.101.155.94/api/')
.value('GET_WORKSHOPS', 'get_workshops/')
.value('GET_ASSIGNMENT', 'scifest_pass_qr_get/')
.value('CHECK_ASSIGNMENT', 'scifest_pass_qr_check/')
.value('GET_SCIFESTPASS', 'scifest_pass_get/')

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.factory('$localstorage', ['$window', function ($window) {
  return {
    set: function (key, value) {
      $window.localStorage[key] = value;
    },
    setStatic: function(key, value) {
      var json = {
        data: []
      }
      for(i = 0; i < value.length; i++)
        json.data.push(value[i]);
      var JSONstring = JSON.stringify(json);
      $window.localStorage[key] = JSONstring;
    },
    get: function (key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    getStatic: function(key) {
      return $window.localStorage[key];
    },
    setObject: function (key, value) {
      $window.localStorage[key] = JSON.stringify(value);
      var itemList = JSON.parse($window.localStorage[0]);
      if(itemList == undefined || itemList == null) {
        itemList = {
          data: []
        }
      }
      if(itemList.data.indexOf(key) == -1)
        itemList.data.push(key);
      $window.localStorage[0] = JSON.stringify(itemList);
    },
    getObject: function (key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
    saveQuestion: function (key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getSavedQuestion: function(key) {
      var question = $window.localStorage[key];
      if(question != null && question != undefined) {
        var parsed = JSON.parse(question);
        return parsed;
      }
      else return null;
    },
    getAll:function() {
      var allItems = [];
      var itemList = null;
      if($window.localStorage[0] != null && $window.localStorage[0] != undefined)
        itemList = JSON.parse($window.localStorage[0]);
      else {
        $window.localStorage[0] = JSON.stringify({data: []});
        itemList = JSON.parse($window.localStorage[0]);
      }
      for(i = 0; i < itemList.data.length; i++) {
        var item = $window.localStorage[itemList.data[i]];
        if(item !== undefined) {
          allItems.push($window.localStorage[itemList.data[i]]);
        }
      }

      return allItems;
    },
    clear: function() {
      $window.localStorage.clear();
    }
  }
}])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'MenuCtrl'
  })

  .state('app.home', {
    url: '/home',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'QuestionsController'
      }
    },
  })

  .state('app.workshops', {
    url: '/workshops',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/workshops.html',
        controller: 'WorkshopsCtrl'
      }
    }
  })

  .state('app.qrcode', {
    url: '/qrcode:qrcode',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/qrcode.html',
        controller: "BarcodeCtrl"
      }
    }
  })
  .state('app.summary', {
    url: '/summary',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/summary.html',
        controller: "SummaryCtrl"
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});

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
  var items = [];
  $window.localStorage[0] = items;

  return {
    set: function (key, value) {
      $window.localStorage[key] = value;
    },
    get: function (key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function (key, value) {
      alert("Saving " + key + ":" + value);
      $window.localStorage[key] = JSON.stringify(value);
      items.push(key);
      $window.localStorage[0] = items;
    },
    getObject: function (key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
    getAll:function() {
      var allItems = [];
      var items = $window.localStorage[0];
      for(i = 0; i < items.length; i++) {
        var item = $window.localStorage[items[i]];
        if(item != undefined) {
          allItems.push($window.localStorage[items[i]]);
        }
      }
      return allItems;
    }
  }
}])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html'
    //controller: 'AppCtrl'
  })

  .state('app.workshops', {
    url: '/workshops',
    views: {
      'menuContent': {
        templateUrl: 'templates/workshops.html',
        controller: 'WorkshopsCtrl'
      }
    }
  })

  .state('app.qrcode', {
    url: '/qrcode',
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
  })
  .state('app.qrdebug', {
    url: '/qrdebug',
    views: {
      'menuContent': {
        templateUrl: 'templates/qrdebug.html',
        controller: 'QRDebugCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/qrcode');
});

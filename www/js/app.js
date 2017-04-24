// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'ngStorage'])

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
    get: function (key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function (key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function (key) {
      return JSON.parse($window.localStorage[key] || '{}');
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

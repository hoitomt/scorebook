var host = 'http://localhost:3000/api/v1';
var db = null;

var app = angular.module('scorebook', ['ionic', 'ngCookies', 'ngMessages', 'ionic-datepicker', 'ngCordova'])

app.constant('Config', {
  'url_auth': host + '/authentication',
  'url_team': host + '/teams',
  'url_game': host + '/games'
});

app.run(function($ionicPlatform, $rootScope, $cookies, $cordovaSQLite, $http, AuthenticationService, RootScopeService, DatabaseService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    if(ionic.Platform.isIpad) {
      db = $cordovaSQLite.openDB({ name: "scorebook" });
    } else {
      db = openDatabase('scorebook', '1.0', 'Scorebook Database', 10 * 1024 * 1024);

    }

    DatabaseService.runMigrations();
  });

  // Set LoggedIn variable - used to control display
  $rootScope.isLoggedIn = AuthenticationService.isAuthenticated;

  // Check logged in status
  $rootScope.tryConnection = RootScopeService.tryConnection;

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    RootScopeService.tryConnection();
    AuthenticationService.authenticate(toState);
  });

  $http.defaults.headers.common.Authorization = 'Token token=' + $cookies.get('apiKey');

});

app.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
  // Each tab has its own nav history stack:
  .state('tab.home', {
    url: '/home',
    authenticate: true,
    cache: false,
    views: {
      'tab-home': {
        templateUrl: 'templates/home.html',
        controller: 'homeController'
      }
    }
  })
  .state('tab.noTab', {
    url: '/notab',
    authenticate: true,
    views: {
      'tab-notab': {
        templateUrl: 'templates/home.html',
        controller: 'homeController'
      }
    }
  })
  .state('tab.newGame', {
    url: '/games/new',
    authenticate: true,
    cache: false,
    views: {
      'tab-notab': {
        templateUrl: 'templates/games/new.html',
        controller: 'gamesController'
      }
    }
  })
  .state('tab.gameDetail', {
    url: '/games/:gameId',
    authenticate: true,
    cache: false,
    views: {
      'tab-notab': {
        templateUrl: 'templates/games/edit.html',
        controller: 'gamesController'
      }
    }
  })
  .state('tab.teams', {
    url: '/teams/index',
    authenticate: true,
    cache: false,
    views: {
      'tab-teams': {
        templateUrl: 'templates/teams/index.html',
        controller: 'teamsController'
      }
    }
  })
  .state('tab.newTeam', {
    url: '/teams/new',
    authenticate: true,
    cache: false,
    views: {
      'tab-notab': {
        templateUrl: 'templates/teams/new.html',
        controller: 'teamsController'
      }
    }
  })
  .state('tab.teamDetail', {
    url: '/teams/:teamId',
    authenticate: true,
    cache: false,
    views: {
      'tab-notab': {
        templateUrl: 'templates/teams/edit.html',
        controller: 'teamsController'
      }
    }
  })
  .state('tab.sync', {
    url: '/sync',
    authenticate: true,
    cache: false,
    views: {
      'tab-sync': {
        templateUrl: 'templates/sync.html',
        controller: 'syncController'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

});

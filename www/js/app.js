var host = 'http://localhost:3000/api/v1';
// var db = null;

var app = angular.module('scorebook', ['ionic', 'ngCookies', 'ngMessages', 'ionic-datepicker', 'ngCordova'])

app.constant('Config', {
  'database_name': 'scorebook',
  'url_auth': host + '/authentication',
  'url_team': function(teamId) {
    if(teamId) {
      return host + '/teams/' + teamId;
    } else {
      return host + '/teams';
    }
  },
  'url_game': function(teamId, gameId) {
    if(gameId) {
      return host + '/teams/' + teamId + '/games/' + gameId;
    } else {
      return host + '/teams/' + teamId + '/games';
    }
  }
});

app.run(function($ionicPlatform, $rootScope, $cookies, $http, AuthenticationService, RootScopeService, DatabaseService) {
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
    DatabaseService.runMigrations();
  });

  // Set LoggedIn variable - used to control display
  $rootScope.isLoggedIn = AuthenticationService.isAuthenticated;

  // Check logged in status
  $rootScope.tryConnection = RootScopeService.tryConnection;

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    RootScopeService.tryConnection().then(function(isConnected){
      AuthenticationService.authenticate(toState, $rootScope.isConnected);
    });
  });

  $http.defaults.headers.common.Authorization = 'Token token=' + $cookies.get('apiKey');

});

app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.views.transition('none');
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
  .state('tab.gameBoxScore', {
    url: '/games/:gameId/box_score',
    authenticate: true,
    cache: false,
    views: {
      'tab-notab': {
        templateUrl: 'templates/games/box_score.html',
        controller: 'boxScoresController'
      }
    }
  })
  .state('tab.teams', {
    url: '/teams',
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
    url: '/teams/:teamId/edit',
    authenticate: true,
    params: {'team': null},
    cache: false,
    views: {
      'tab-notab': {
        templateUrl: 'templates/teams/edit.html',
        controller: 'playersController'
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

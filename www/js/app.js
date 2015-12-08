var host = 'http://localhost:3000';

var app = angular.module('scorebook', ['ionic', 'ngCookies', 'ngMessages'])

app.constant('Config', {
  'DB_NAME': 'scorebook',
  'AUTH_URL': host + '/api/v1/authentication'
});

app.run(function($ionicPlatform, $rootScope, $cookies, AuthenticationService) {
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
  });

  // Set LoggedIn variable - used to control display
  $rootScope.isLoggedIn = AuthenticationService.isAuthenticated();

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    AuthenticationService.authenticate(toState);
  });

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
    views: {
      'tab-home': {
        templateUrl: 'templates/home.html',
        controller: 'homeController'
      }
    }
  })
  .state('tab.teams', {
    url: '/teams/index',
    views: {
      'tab-teams': {
        templateUrl: 'templates/teams/index.html',
        controller: 'teamsController'
      }
    }
  })
  .state('tab.games' ,{
    url: '/games/index',
    views: {
      'tab-home': {
        templateUrl: 'templates/games/index.html',
        controller: 'gamesController'
      }
    }
  })
  .state('tab.newGame', {
    url: '/games/new',
    views: {
      'tab-home': {
        templateUrl: 'templates/games/new.html',
        controller: 'gamesController'
      }
    }
  })

  // .state('home', {
  //   url: '/',
  //   templateUrl: 'templates/home.html',
  //   authenticate: true
  // })
  // .state('new-game', {
  //   url: '/games/new',
  //   templateUrl: 'templates/games/new.html',
  //   authenticate: true
  // })
  // .state('game-detail', {
  //   url: '/games/:gameId',
  //   templateUrl: 'templates/games/edit.html',
  //   authenticate: true
  // })
  // .state('login', {
  //   url: '/login',
  //   templateUrl: 'templates/login.html'
  // })
  // .state('logout', {
  //   url: '/logout',
  //   templateUrl: 'templates/home.html',
  //   authenticate: true
  // })
  // .state('new-team', {
  //   url: '/teams/new',
  //   templateUrl: 'templates/teams/new.html',
  //   authenticate: true
  // })
  // .state('team-detail', {
  //   url: '/teams/:teamId',
  //   templateUrl: 'templates/teams/edit.html',
  //   authenticate: true
  // })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

});

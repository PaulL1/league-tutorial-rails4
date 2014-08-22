/**
 * Login module
 */
angular.module( 'league.login', [
  'ui.state'
])

/**
 * Define the route that this module relates to, and the page template and controller that is tied to that route
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'login', {
    url: '/login?message',
    views: {
      "main": {
        controller: 'LoginCtrl',
        templateUrl: 'login/login.tpl.html'
      }
    },
    data:{ pageTitle: 'Login' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'LoginCtrl', function LoginController( $scope, $http, $state, $stateParams, errorService ) {
  if( $stateParams.message == 'confirm' ) {
    $scope.errors = {message: 'Your e-mail has ben confirmed, please log in', errors: {}};
  } else if( $stateParams.message == 'unlock' ) {
    $scope.errors = {message: 'Your account has been unlocked, please log in', errors: {}};
  } else {
    $scope.errors = {message: null, errors: {}};
  }
  
  $scope.reset_users = function() {
    $scope.login_user = {email: null, password: null};
  };
  
  $scope.reset_users();

  $scope.login = function() {
    $http.post('../users/sign_in.json', {user: {email: $scope.login_user.email, password: $scope.login_user.password}})
      .success( function( data, status ) {
        errorService.success( data, status, 'logged in', $scope);
      })
      .error( function( data, status ) {
        errorService.failure( data, status, $scope);
      });
  };

  $scope.logout = function() {
    $http({method: 'DELETE', url: '../users/sign_out.json', data: {}})
      .success( function( data, status ) {
        errorService.success( data, status, 'logged out', $scope);
      })
      .error( function( data, status ) {
        errorService.failure( data, status, $scope);
      });
  };

  $scope.forgot_password = function() {
    $http({method: 'POST', 
           url: '../users/password.json',
           data: {user: {email: $scope.login_user.email}}})
      .success( function( data, status ) {
        errorService.success( data, status, 'If your e-mail address is on file then password reset instructions have been sent to that e-mail address', $scope);
      })
      .error( function( data, status ) {
        errorService.failure( data, status, $scope);
      });
  };
  
  $scope.unlock = function() {
    $http({method: 'POST', 
           url: '../users/unlock.json',
           data: {user: {email: $scope.login_user.email}}})
      .success( function( data, status ) {
        errorService.success( data, status, 'If your e-mail address is on file and your account is locked then unlock instructions have been sent to that e-mail address', $scope);
      })
      .error( function( data, status ) {
        errorService.failure( data, status, $scope);
      });
  };
  
  $scope.confirm = function() {
    $http({method: 'POST', 
           url: '../users/confirmation.json',
           data: {user: {email: $scope.login_user.email}}})
      .success( function( data, status ) {
        errorService.success( data, status, 'If your e-mail address is on file then a new confirmation link has been sent to that e-mail address', $scope);
      })
      .error( function( data, status ) {
        errorService.failure( data, status, $scope);
      });
  };
})
;
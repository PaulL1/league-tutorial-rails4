/**
 * Registeration module
 */
angular.module( 'league.register', [
  'ui.state'
])

/**
 * Define the route that this module relates to, and the page template and controller that is tied to that route
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'register', {
    url: '/register?resetToken',
    views: {
      "main": {
        controller: 'RegisterCtrl',
        templateUrl: 'register/register.tpl.html'
      }
    },
    data:{ pageTitle: 'Register' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'RegisterCtrl', function RegisterController( $scope, $http, $state, $stateParams, errorService ) {
  
  $scope.reset_users = function() {
    $scope.register_user = {email: null, password: null, password_confirmation: null};
  };
  
  $scope.reset_users();

  if($stateParams.resetToken){
    $scope.errors = {message: 'Please enter a new password and confirmation', errors: {}};
    $scope.register_user.reset_password_token = $stateParams.resetToken;
  } else {
    $scope.errors = {message: null, errors: {}};
  }

  $scope.register = function() {
    $http({method: 'POST', 
           url: '../users.json',
           data: {user: {email: $scope.register_user.email,
                         password: $scope.register_user.password,
                         password_confirmation: $scope.register_user.password_confirmation}}})
      .success( function( data, status ) {
        errorService.success( data, status, 'Thank you for registering, you are logged in', $scope);
      })
      .error( function( data, status ) {
        errorService.failure( data, status, $scope);
      });
  };

  $scope.change_password = function() {
    $http({method: 'PUT', 
           url: '../users.json',
           data: {user: {email: $scope.register_user.email,
                         password: $scope.register_user.password,
                         password_confirmation: $scope.register_user.password_confirmation,
                         current_password: $scope.register_user.current_password }}})
      .success( function( data, status ) {
        errorService.success( data, status, 'Your password has been changed', $scope);
      })
      .error( function( data, status ) {
        errorService.failure( data, status, $scope);
      });
  };

  $scope.reset_password = function() {
    $http({method: 'PUT', 
           url: '../users/password.json',
           data: {user: {email: $scope.register_user.email,
                         password: $scope.register_user.password,
                         password_confirmation: $scope.register_user.password_confirmation,
                         reset_password_token: $scope.register_user.reset_password_token }}})
      .success( function( data, status ) {
        errorService.success( data, status, 'Your password has been changed, you are logged in', $scope);
      })
      .error( function( data, status ) {
        errorService.failure( data, status, $scope);
      });
  };

  
})
;
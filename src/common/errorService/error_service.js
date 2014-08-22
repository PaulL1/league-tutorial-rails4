/*
 * Error handling service, deals with return values from the Devise $http calls
 * 
 */

angular.module( 'common.errorService', [])

.service('errorService', function( ) {
  return {
    success: function( data, status, success_message, $scope ) {
      if (status == 201 || status == 204){
        $scope.errors.message = success_message;
        $scope.reset_users();
      } else {
        if (data.error) {
          $scope.errors.message = data.error;
        } else {
          // note that JSON.stringify is not supported in some older browsers, we're ignoring that
          $scope.errors.message = "Success, but with an unexpected success code, potentially a server error, please report via support channels as this indicates a code defect.  Server response was: " + JSON.stringify(data);
        }
      }
    },
  
    failure: function( data, status, $scope ) {
      if (status == 422) {
        $scope.errors.errors = data.errors;          
      } else {
        if (data.error) {
          $scope.errors.message = data.error;
        } else {
          // note that JSON.stringify is not supported in some older browsers, we're ignoring that
          $scope.errors.message = "Unexplained error, potentially a server error, please report via support channels as this indicates a code defect.  Server response was: " + JSON.stringify(data);
        }
      }
    }
  };
});
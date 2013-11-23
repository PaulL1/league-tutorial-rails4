/**
 * Club module
 */
angular.module( 'league.club', [
  'ui.state',
  'ngResource',
  'ngGrid'
])

/**
 * Define the route that this module relates to, and the page template and controller that is tied to that route
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'clubs', {
    url: '/clubs',
    views: {
      "main": {
        controller: 'ClubsCtrl',
        templateUrl: 'club/clubs.tpl.html'
      }
    },
    data:{ pageTitle: 'Clubs' }
  })
  .state( 'club', {
    url: '/club?clubId',
    views: {
      "main": {
        controller: 'ClubCtrl',
        templateUrl: 'club/club.tpl.html'
      }
    },
    data:{ pageTitle: 'Club'
    }
  });  
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'ClubsCtrl', function ClubsController( $scope, ClubRes, $state ) {
  $scope.clubs = ClubRes.query();
  $scope.gridOptions = {
    data: 'clubs',
    columnDefs: [
      {field: 'id', displayName: 'Id'},
      {field: 'name', displayName: 'Club Name'},
      {field: 'contact_officer', displayName: 'Contact Officer'},
      {displayName: 'Edit', cellTemplate: '<button id="editBtn" type="button" class="btn-small" ng-click="editClub(row.entity)" >Edit</button> '}
    ],
    multiSelect: false
  };

  $scope.editClub = function(club) {
    $state.transitionTo('club', { clubId: club.id });
  };

  $scope.newClub = function() {
    $state.transitionTo('club');
  };

})

.controller('ClubCtrl', function ClubController( $scope, ClubRes, $state, $stateParams ) {
  $scope.clubId = parseInt($stateParams.clubId, 10);

  if ($scope.clubId) {
    $scope.club = ClubRes.get({id: $scope.clubId});
  } else {
    $scope.club = new ClubRes();
  }  

  $scope.submit = function() {
    if ($scope.clubId) {
      $scope.club.$update(function(response) {
        $state.transitionTo('clubs');
      });
    }
    else {
      $scope.club.$save(function(response) {
        $state.transitionTo('clubs');
      });
    }
  };

  $scope.cancel = function() {
    $state.transitionTo('clubs');
  };
})
/**
 * Add a resource to allow us to get at the server
 */
.factory( 'ClubRes', function ( $resource )  {
  return $resource("../clubs/:id.json", {id:'@id'}, {'update': {method:'PUT'}});
})
;
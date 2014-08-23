/**
 * Club module
 */
angular.module( 'league.club', [
  'ui.state',
  'ngResource',
  'ui.grid',
  'ui.grid.resizeColumns',
  'ui.grid.edit'
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
  $scope.$scope = $scope;
  $scope.clubs = ClubRes.query();
  $scope.gridOptions = {
    data: 'clubs',
    columnDefs: [
      {field: 'id', displayName: 'Id'},
      {field: 'name', displayName: 'Club Name'},
      {field: 'contact_officer', displayName: 'Contact Officer'},
      {name: 'edit', displayName: 'Edit', cellTemplate: '<button id="editBtn" type="button" class="btn-small" ng-click="getExternalScopes().editClub(row.entity)" >Edit</button> '},
      {name: 'delete', displayName: 'Delete', cellTemplate: '<button id="deleteBtn" type="button" class="btn-small" ng-click="getExternalScopes().deleteClub(row.entity)" >Delete</button> '},
      {name: 'show_teams', displayName: 'Show Teams', cellTemplate: '<button id="showBtn" type="button" class="btn-small" ng-click="getExternalScopes().showTeams(row.entity)" >Show Teams</button> '}
    ],
    multiSelect: false,
    enableFiltering: true
  };

  $scope.gridOptions.onRegisterApi = function( gridApi ) {
    gridApi.edit.on.afterCellEdit( $scope, function( rowEntity, colDef ) {
      rowEntity.$update( function( response ) {
        $scope.error = null;
      }, function( error ) {
        $scope.error = error;
      });
    });
  };
  
  $scope.editClub = function(club) {
    $state.transitionTo('club', { clubId: club.id });
  };

  $scope.deleteClub = function(club) {
    club.$remove(function(response) {
      $scope.clubs = ClubRes.query();
    }, function(error) {
      $scope.error = error.data;
    });
  };

  $scope.newClub = function() {
    $state.transitionTo('club');
  };
  
  $scope.showTeams = function(club) {
    $state.transitionTo('teams', {clubId: club.id});
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
      }, function(error) {
        $scope.error = error.data;
      });
    }
    else {
      $scope.club.$save(function(response) {
        $state.transitionTo('clubs');
      }, function(error) {
        $scope.error = error.data;
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
  return $resource("../clubs/:id.json", {id:'@id'}, {'update': {method:'PUT'}, 'remove': {method: 'DELETE', headers: {'Content-Type': 'application/json'}}});
})
;
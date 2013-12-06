/**
 * Club module
 */
angular.module( 'league.team', [
  'ui.state',
  'league.club',
  'ngResource',
  'ngGrid'
])

/**
 * Define the route that this module relates to, and the page template and controller that is tied to that route
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'teams', {
    url: '/teams?clubId',
    views: {
      "main": {
        controller: 'TeamsCtrl',
        templateUrl: 'team/teams.tpl.html'
      }
    },
    data:{ pageTitle: 'Teams' }
  })
  .state( 'team', {
    url: '/team?teamId&clubId',
    views: {
      "main": {
        controller: 'TeamCtrl',
        templateUrl: 'team/team.tpl.html'
      }
    },
    data:{ pageTitle: 'Team'
    }
  });  
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'TeamsCtrl', function TeamsController( $scope, TeamRes, $state, $stateParams ) {
  $scope.teams = TeamRes.query();

  $scope.clubId = $stateParams.clubId;

  if($scope.clubId) {
    $scope.filterOptions = {
      filterText: 'club_id:' + $scope.clubId
    };
  }
  else {
    $scope.filterOptions = {
      filterText: ''
    };
  }

  $scope.gridOptions = {
    data: 'teams',
    columnDefs: [
      {field: 'id', displayName: 'Id'},
      {field: 'club_id', displayName: 'Club Id', visible: false},
      {field: 'club_name', displayName: 'Club Name'},
      {field: 'name', displayName: 'Team Name'},
      {field: 'captain', displayName: 'Captain'},
      {field: 'date_created', displayName: 'Date Created', cellFilter: "date:mediumDate"},
      {displayName: 'Edit', cellTemplate: '<button id="editBtn" type="button" class="btn-small" ng-click="editTeam(row.entity)" >Edit</button> '},
      {displayName: 'Delete', cellTemplate: '<button id="deleteBtn" type="button" class="btn-small" ng-click="deleteTeam(row.entity)" >Delete</button> '}
    ],
    multiSelect: false,
    filterOptions: $scope.filterOptions,
    showColumnMenu: true    
  };

  $scope.editTeam = function(team) {
    $state.transitionTo('team', { teamId: team.id });
  };

  $scope.deleteTeam = function(team) {
    team.$remove(function(response) {
      $scope.teams = TeamRes.query();
    }, function(error) {
      $scope.error = error.data;
    });
  };

  $scope.newTeam = function() {
    $state.transitionTo('team', {clubId: $scope.clubId});
  };

})

.controller('TeamCtrl', function TeamController( $scope, TeamRes, ClubRes, $state, $stateParams ) {
  $scope.teamId = parseInt($stateParams.teamId, 10);
  $scope.clubId = parseInt($stateParams.clubId, 10);

  if ($scope.teamId) {
    $scope.team = TeamRes.get({id: $scope.teamId});
  } else {
    $scope.team = new TeamRes();
    if($scope.clubId) {
      $scope.team.club_id = $scope.clubId;
    }
  }  
  
  $scope.clubs = ClubRes.query();
  
  $scope.submit = function() {
    if ($scope.teamId) {
      $scope.team.$update(function(response) {
        $state.transitionTo('teams');
      }, function(error) {
        $scope.error = error.data;
      });
    }
    else {
      $scope.team.$save(function(response) {
        $state.transitionTo('teams');
      }, function(error) {
        $scope.error = error.data;
      });
    }
  };

  $scope.cancel = function() {
    $state.transitionTo('teams');
  };
})
/**
 * Add a resource to allow us to get at the server
 */
.factory( 'TeamRes', function ( $resource )  {
  return $resource("../teams/:id.json", {id:'@id'}, {'update': {method:'PUT'}, 'remove': {method: 'DELETE', headers: {'Content-Type': 'application/json'}}});
})
;
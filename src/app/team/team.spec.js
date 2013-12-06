/**
 * Unit tests for the team functionality
 */
describe( 'Team functionality', function() {
  // mock Application to allow us to inject our own dependencies
  beforeEach(angular.mock.module('league'));

  // create the custom mocks on the root scope
  beforeEach(angular.mock.inject(function($rootScope, _$httpBackend_, $state){
    //create an empty scope
    scope = $rootScope.$new();

    // we're just declaring the httpBackend here, we're not setting up expectations or when's - they change on each test
    scope.httpBackend = _$httpBackend_;
    scope.$state = $state;
  }));
  
  afterEach(function() {
    scope.httpBackend.verifyNoOutstandingExpectation();
    scope.httpBackend.verifyNoOutstandingRequest();
  });
  
 describe( 'Teams list controller', function() {  

    beforeEach(angular.mock.inject(function($controller){
      //declare the controller and inject our scope
      $controller('TeamsCtrl', {$scope: scope, $state: scope.$state});

      // setup a mock for the resource - instead of calling the server always return a pre-canned response
      scope.httpBackend.expect('GET', '../teams.json').respond([
          {"captain":"Captain 1","created_at":"2012-02-02T00:00:00Z","date_created":"2012-01-01T00:00:00Z","id":1,"name":"Team 1","updated_at":"2012-03-03T00:00:00Z"},
          {"captain":"Captain 2","created_at":"2012-02-02T00:00:00Z","date_created":"2012-01-01T00:00:00Z","id":2,"name":"Team 2","updated_at":"2012-03-03T00:00:00Z"}
      ]);
      scope.$digest();
      scope.httpBackend.flush();
    }));
    
    describe( 'Initial render', function() {
      it('Has two teams defined', function(){
        expect(scope.teams.length).toEqual(2);
      });

      it('First team\'s captain is as expected', function(){
        expect(scope.teams[0].captain).toEqual('Captain 1');
      });
    });
    
    describe('Other controller methods', function(){
      it('Calls edit on first row', function() {
        // we expect it to call $state
        spyOn(scope.$state, "transitionTo").andCallThrough();

        // call edit
        scope.editTeam(scope.teams[0]);

        // we expect the team state to be called, passing in the id of the first item
        expect(scope.$state.transitionTo).toHaveBeenCalledWith('team', { teamId: 1});
      });

      it('Calls delete on first row, success', function() {
        scope.httpBackend.expect('DELETE', '../teams/1.json').respond();
        scope.httpBackend.expect('GET', '../teams.json').respond([
          {"captain":"Captain 1","created_at":"2012-02-02T00:00:00Z","date_created":"2012-01-01T00:00:00Z","id":1,"name":"Team 1","updated_at":"2012-03-03T00:00:00Z"},
          {"captain":"Captain 2","created_at":"2012-02-02T00:00:00Z","date_created":"2012-01-01T00:00:00Z","id":2,"name":"Team 2","updated_at":"2012-03-03T00:00:00Z"}
        ]);

        // call edit
        scope.deleteTeam(scope.teams[0]);

        scope.$digest();
        scope.httpBackend.flush();
      });

      it('Calls delete on first row, success', function() {
        scope.httpBackend.expect('DELETE', '../teams/1.json').respond(409, { error: "You can't do that"});

        // call edit
        scope.deleteTeam(scope.teams[0]);

        scope.$digest();
        scope.httpBackend.flush();
        expect(scope.error).toEqual({ error: "You can't do that" });
      });

      it('Calls new', function() {
        // we expect it to call $state
        spyOn(scope.$state, "transitionTo").andCallThrough();

        // call new
        scope.newTeam();

        // we expect the team state to be called, passing in the id of the first item
        expect(scope.$state.transitionTo).toHaveBeenCalledWith('team', {clubId: undefined});
      });
    });
  });
  
  describe( 'Team detail controller', function() {
    //mock the controller
    beforeEach(function() {
      // mock the stateParams
      scope.fakeStateParams = {
        teamId: "2"
      };      
    });

    describe( 'Team detail controller base tests:', function() {  
      it('Initial detail controller render receives a team id, gets team, success', angular.mock.inject(function($controller){
        // use default teamId of 2
        $controller('TeamCtrl', { $scope: scope, $stateParams: scope.fakeStateParams });
        expect(scope.teamId).toEqual(2);
  
        scope.httpBackend.expectGET('../teams/2.json').respond({"captain":"Captain 2","created_at":"2012-02-02T00:00:00Z","date_created":"2012-01-01T00:00:00Z","id":2,"name":"Team 2","updated_at":"2012-03-03T00:00:00Z"});
        scope.httpBackend.expect('GET', '../clubs.json').respond([]);

        scope.$digest();  
        scope.httpBackend.flush();
        expect(scope.team.name).toEqual('Team 2');     
      }));  
  
      it('Initial detail controller render does not receive a team id, creates new team, success', angular.mock.inject(function( $controller) {
        // set teamId to null
        scope.fakeStateParams.teamId = null;
        
        $controller('TeamCtrl', { $scope: scope, $stateParams: scope.fakeStateParams });
        scope.httpBackend.expect('GET', '../clubs.json').respond([]);

        scope.$digest();  
        scope.httpBackend.flush();
        expect(scope.teamId).toBeNaN();
      }));             
    });
    
    describe( 'Team detail controller update method tests', function() {
      beforeEach(angular.mock.inject(function($controller){
        $controller('TeamCtrl', {$scope: scope, $stateParams: scope.fakeStateParams});

        // The initial render triggers a get, drain that before we start the test proper
        scope.httpBackend.expectGET('../teams/2.json').respond({"captain":"Captain 2","created_at":"2012-02-02T00:00:00Z","date_created":"2012-01-01T00:00:00Z","id":2,"name":"Team 2","updated_at":"2012-03-03T00:00:00Z"});
        scope.httpBackend.expect('GET', '../clubs.json').respond([]);

        scope.$digest();
        scope.httpBackend.flush();
       }));
      
      it('Submit with teamId calls put on server, put succeeds', function(){
        spyOn(scope.$state, "transitionTo").andCallThrough();

        scope.team.name = 'Changed name';     
        scope.submit();
        
        scope.httpBackend.expectPUT('../teams/2.json').respond({});
        scope.$digest();
        scope.httpBackend.flush();
        expect(scope.$state.transitionTo).toHaveBeenCalledWith('teams');
      });

      it('Submit with teamId calls put on server, put fails', function(){
        spyOn(scope.$state, "transitionTo").andCallThrough();

        scope.team.name = 'Changed name';     
        scope.submit();
        
        scope.httpBackend.expectPUT('../teams/2.json').respond(422, {"name":["can't be blank"]});
        scope.$digest();
        scope.httpBackend.flush();
        expect(scope.$state.transitionTo).not.toHaveBeenCalledWith('teams');
        expect(scope.error).toEqual( { name: [ "can't be blank" ] });
      });      
    });

    describe( 'Team detail controller save method tests', function() {
      beforeEach(angular.mock.inject(function($controller){
        scope.fakeStateParams.teamId = null;
        $controller('TeamCtrl', {$scope: scope, $stateParams: scope.fakeStateParams});
        scope.httpBackend.expect('GET', '../clubs.json').respond([]);

        scope.$digest();
        scope.httpBackend.flush();
       }));
      
      it('Submit with teamId calls post on server, post succeeds', function(){
        spyOn(scope.$state, "transitionTo").andCallThrough();

        scope.team.name = 'Changed name';     
        scope.submit();
        
        scope.httpBackend.expectPOST('../teams.json').respond({});
        scope.$digest();
        scope.httpBackend.flush();
        expect(scope.$state.transitionTo).toHaveBeenCalledWith('teams');
      });

      it('Submit with teamId calls post on server, post fails', function(){
        spyOn(scope.$state, "transitionTo").andCallThrough();

        scope.team.name = 'Changed name';     
        scope.submit();
        
        scope.httpBackend.expectPOST('../teams.json').respond(422, {"name":["can't be blank"]});
        scope.$digest();
        scope.httpBackend.flush();
        expect(scope.$state.transitionTo).not.toHaveBeenCalledWith('teams');
        expect(scope.error).toEqual( { name: [ "can't be blank" ] });
      });      
    });
  });
});
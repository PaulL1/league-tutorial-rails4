/**
 * Unit tests for the club functionality
 */
describe( 'Club functionality', function() {
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
  
 describe( 'Clubs list controller', function() {  

    beforeEach(angular.mock.inject(function($controller){
      //declare the controller and inject our scope
      $controller('ClubsCtrl', {$scope: scope, $state: scope.$state});

      // setup a mock for the resource - instead of calling the server always return a pre-canned response
      scope.httpBackend.expect('GET', '../clubs.json').respond([
        {"contact_officer":"Contact Officer 1","created_at":"2012-02-02T00:00:00Z","date_created":"2012-01-01T00:00:00Z","id":1,"name":"Club 1","updated_at":"2012-03-03T00:00:00Z"},
        {"contact_officer":"Contact Officer 2","created_at":"2012-02-02T00:00:00Z","date_created":"2012-01-01T00:00:00Z","id":2,"name":"Club 2","updated_at":"2012-03-03T00:00:00Z"}
      ]);
      scope.$digest();
      scope.httpBackend.flush();
    }));
    
    describe( 'Initial render', function() {
      it('Has two clubs defined', function(){
        expect(scope.clubs.length).toEqual(2);
      });

      it('First club\'s contact officer is as expected', function(){
        expect(scope.clubs[0].contact_officer).toEqual('Contact Officer 1');
      });
    });
    
    describe('Other controller methods', function(){
      it('Calls edit on first row', function() {
        // we expect it to call $state
        spyOn(scope.$state, "transitionTo").andCallThrough();

        // call edit
        scope.editClub(scope.clubs[0]);

        // we expect the club state to be called, passing in the id of the first item
        expect(scope.$state.transitionTo).toHaveBeenCalledWith('club', { clubId: 1});
      });

      it('Calls new', function() {
        // we expect it to call $state
        spyOn(scope.$state, "transitionTo").andCallThrough();

        // call new
        scope.newClub();

        // we expect the club state to be called, passing in the id of the first item
        expect(scope.$state.transitionTo).toHaveBeenCalledWith('club');
      });
    });
  });
  
  describe( 'Club detail controller', function() {
    //mock the controller
    beforeEach(function() {
      // mock the stateParams
      scope.fakeStateParams = {
        clubId: "2"
      };      
    });

    describe( 'Club detail controller base tests:', function() {  
      it('Initial detail controller render receives a club id, gets club, success', angular.mock.inject(function($controller){
        // use default clubId of 2
        $controller('ClubCtrl', { $scope: scope, $stateParams: scope.fakeStateParams });
        expect(scope.clubId).toEqual(2);
  
        scope.httpBackend.expectGET('../clubs/2.json').respond({"contact_officer":"Contact Officer 2","created_at":"2012-02-02T00:00:00Z","date_created":"2012-01-01T00:00:00Z","id":2,"name":"Club 2","updated_at":"2012-03-03T00:00:00Z"});

        scope.$digest();  
        scope.httpBackend.flush();
        expect(scope.club.name).toEqual('Club 2');     
      }));  
  
      it('Initial detail controller render does not receive a club id, creates new club, success', angular.mock.inject(function( $controller) {
        // set clubId to null
        scope.fakeStateParams.clubId = null;
        
        $controller('ClubCtrl', { $scope: scope, $stateParams: scope.fakeStateParams });
        expect(scope.clubId).toBeNaN();
      }));             
    });
    
    describe( 'Club detail controller update method tests', function() {
      beforeEach(angular.mock.inject(function($controller){
        $controller('ClubCtrl', {$scope: scope, $stateParams: scope.fakeStateParams});

        // The initial render triggers a get, drain that before we start the test proper
        scope.httpBackend.expectGET('../clubs/2.json').respond({"contact_officer":"Contact Officer 2","created_at":"2012-02-02T00:00:00Z","date_created":"2012-01-01T00:00:00Z","id":2,"name":"Club 2","updated_at":"2012-03-03T00:00:00Z"});

        scope.$digest();
        scope.httpBackend.flush();
       }));
      
      it('Submit with clubId calls put on server, put succeeds', function(){
        spyOn(scope.$state, "transitionTo").andCallThrough();

        scope.club.name = 'Changed name';     
        scope.submit();
        
        scope.httpBackend.expectPUT('../clubs/2.json').respond({});
        scope.$digest();
        scope.httpBackend.flush();
        expect(scope.$state.transitionTo).toHaveBeenCalledWith('clubs');
      });
    });

    describe( 'Club detail controller save method tests', function() {
      beforeEach(angular.mock.inject(function($controller){
        scope.fakeStateParams.clubId = null;
        $controller('ClubCtrl', {$scope: scope, $stateParams: scope.fakeStateParams});
       }));
      
      it('Submit with clubId calls post on server, post succeeds', function(){
        spyOn(scope.$state, "transitionTo").andCallThrough();

        scope.club.name = 'Changed name';     
        scope.submit();
        
        scope.httpBackend.expectPOST('../clubs.json').respond({});
        scope.$digest();
        scope.httpBackend.flush();
        expect(scope.$state.transitionTo).toHaveBeenCalledWith('clubs');
      });
    });
  });
});
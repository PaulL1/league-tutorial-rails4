/**
 * Unit tests for the club functionality
 */
describe( 'Clubs list controller', function() {
  var scope, httpBackend;

  //mock Application to allow us to inject our own dependencies
  beforeEach(angular.mock.module('league'));

  //mock the controller for the same reason and include $rootScope and $controller
  beforeEach(angular.mock.inject(function($rootScope, $controller, _$httpBackend_ ){
    //create an empty scope
    scope = $rootScope.$new();

    scope.httpBackend = _$httpBackend_;
    scope.httpBackend.expect('GET', '../clubs.json').respond([
      {"contact_officer":"Officer 1","created_at":"2012-02-02T00:00:00Z","date_created":"2012-01-01T00:00:00Z","id":1,"name":"Club 1","updated_at":"2012-03-03T00:00:00Z"},
      {"contact_officer":"Officer 2","created_at":"2012-02-02T00:00:00Z","date_created":"2012-01-01T00:00:00Z","id":2,"name":"Club 2","updated_at":"2012-03-03T00:00:00Z"}]);

    //declare the controller and inject our empty scope
    $controller('ClubsCtrl', {$scope: scope});
  }));

  // tests start here
  it('Has two clubs defined', function(){
    scope.$digest();
    scope.httpBackend.flush();
    expect(scope.clubs.length).toEqual(2);
  });

  it('First club\'s contact officer is as expected', function(){
    scope.$digest();
    scope.httpBackend.flush();
    expect(scope.clubs[0].contact_officer).toEqual('Officer 1');
  });

});
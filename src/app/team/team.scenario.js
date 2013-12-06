/**
 * End to end tests for the team functionality
 */

var homePage = require('../home/home.part.scenario.js');
var teamsPage = require('./teams.part.scenario.js');

describe( 'Navigate to team list page', function() {
  it ( 'should allow navigation to the team list page', function() {

    homePage.go();
    expect(homePage.teamsLink.getText()).toEqual('Teams');

    homePage.teamsLink.click();

    expect(teamsPage.title.getText()).toEqual('Team functions');
    expect(teamsPage.description.getText()).toEqual('Soon this will show a list of all the teams, based on information from the server');
    expect(teamsPage.teamTableElement(0, 'name').getText()).toEqual('First team');    
    expect(teamsPage.teamTableElement(0, 'captain').getText()).toEqual('C.F.Captain');    
    expect(teamsPage.teamTableElement(1, 'name').getText()).toEqual('Second team');    
    expect(teamsPage.teamTableElement(1, 'captain').getText()).toEqual('A.N.Captain');    
  }); 

  it ( 'should allow us to go directly to the team list page', function() {
    teamsPage.go();

    expect(teamsPage.title.getText()).toEqual('Team functions');
    expect(teamsPage.description.getText()).toEqual('Soon this will show a list of all the teams, based on information from the server');
    expect(teamsPage.teamTableElement(0, 'name').getText()).toEqual('First team');    
    expect(teamsPage.teamTableElement(0, 'captain').getText()).toEqual('C.F.Captain');    
    expect(teamsPage.teamTableElement(1, 'name').getText()).toEqual('Second team');    
    expect(teamsPage.teamTableElement(1, 'captain').getText()).toEqual('A.N.Captain');    
  }); 
});
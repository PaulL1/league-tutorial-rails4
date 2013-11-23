/**
 * End to end tests for the club functionality
 */

var homePage = require('../home/home.part.scenario.js');
var clubsPage = require('./clubs.part.scenario.js');

describe( 'Navigate to club list page', function() {
  it ( 'should allow navigation to the club list page', function() {

    homePage.go();
    expect(homePage.clubsLink.getText()).toEqual('Clubs');

    homePage.clubsLink.click();

    expect(clubsPage.title.getText()).toEqual('Club functions');
    expect(clubsPage.description.getText()).toEqual('Soon this will show a list of all the clubs, based on information from the server');
    expect(clubsPage.clubTableElement(0, 'name').getText()).toEqual('First club');    
    expect(clubsPage.clubTableElement(0, 'contact_officer').getText()).toEqual('A Person');    
    expect(clubsPage.clubTableElement(1, 'name').getText()).toEqual('Second club');    
    expect(clubsPage.clubTableElement(1, 'contact_officer').getText()).toEqual('J Jones');    
  }); 

  it ( 'should allow us to go directly to the club list page', function() {
    clubsPage.go();

    expect(clubsPage.title.getText()).toEqual('Club functions');
    expect(clubsPage.description.getText()).toEqual('Soon this will show a list of all the clubs, based on information from the server');
    expect(clubsPage.clubTableElement(0, 'name').getText()).toEqual('First club');    
    expect(clubsPage.clubTableElement(0, 'contact_officer').getText()).toEqual('A Person');    
    expect(clubsPage.clubTableElement(1, 'name').getText()).toEqual('Second club');    
    expect(clubsPage.clubTableElement(1, 'contact_officer').getText()).toEqual('J Jones');    
  }); 
});
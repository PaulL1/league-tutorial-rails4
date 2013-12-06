/**
 * Partial for the page objects associated with home
 */
var Page = require('astrolabe').Page;

module.exports = Page.create({
  url: { value: 'UI/index.html' },
  clubsLink: { get: function() { return this.findElement(this.by.id('clubsLink')); } }, 
  teamsLink: { get: function() { return this.findElement(this.by.id('teamsLink')); } }  
});
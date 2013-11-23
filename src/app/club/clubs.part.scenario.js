/**
 * Partial for the page objects associated with clubs
 */
var Page = require('astrolabe').Page;

module.exports = Page.create({
  url: { value: 'UI/index.html#/clubs' },
  title: { get: function() { return this.findElement(this.by.id('title')); } },
  description: { get: function() { return this.findElement(this.by.id('description')); } },
  clubTableElement: { value: function(rowNum, columnBinding) { 
    return this.findElement(this.by.repeater('row in renderedRows').row(rowNum).column(columnBinding)); } }
  }
);
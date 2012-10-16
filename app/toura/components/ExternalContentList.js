dojo.provide("toura.components.ExternalContentList");

dojo.require("mulberry._Component");
dojo.require("toura.components.ChildNodesFromSource");

dojo.declare("toura.components.ExternalContentList", mulberry._Component, {
  templateString : dojo.cache('toura.components', 'ExternalContentList/ExternalContentList.haml'),

  prepareData : function() {
    this.externalContents = this.node.externalContent;
  },

  commaStopper : false
});

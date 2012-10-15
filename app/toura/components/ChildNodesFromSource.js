dojo.provide('toura.components.ChildNodesFromSource');

dojo.require('toura.components.ChildNodes');
dojo.require('toura.models.ExternalContent');

dojo.declare('toura.components.ChildNodesFromSource', toura.components.ChildNodes, {
  templateString : dojo.cache('toura.components', 'ChildNodesFromSource/ChildNodesFromSource.haml'),
  itemTemplate : dojo.cache('toura.components', 'ChildNodesFromSource/ChildNodesFromSourceItem.haml'),

  postCreate : function() {
    this.inherited(arguments);

    dojo.when(this.node.children.query({ 'source' : this.source }), dojo.hitch(this, function(data) {
      this.setStore(data);
    }));
  },

  setupContainer : function() {
    this.container = this.itemList;
  },

  commaStopper : false
});

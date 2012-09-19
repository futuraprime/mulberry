dojo.provide('toura.components.ChildNodes');

dojo.require('mulberry._Component');

dojo.declare('toura.components.ChildNodes', mulberry._Component, {
  templateString : dojo.cache('toura.components', 'ChildNodes/ChildNodes.haml'),
  itemTemplate: Haml(dojo.cache('toura.components', 'ChildNodes/ChildNodesItem.haml')),
  handleClicks : true,

  prepareData : function() {
    this.children = this.node.children || [];
  },

  adjustMarkup : function() {
    if (!this.children.length) {
      this.addClass('empty');
    }
    this.populate(this.itemTemplate, this.children);
  },

  _clickHandler : function(t, e) {
    dojo.addClass(t, 'tapped');
  },

  _updateNodes : function() {
    this.children = this.node.children || {};
    this._updateDisplay();
  },

  _updateDisplay : function() {
    this.populate(this.itemTemplate, this.children);

    if (this.children.length > 0) {
      this.removeClass('empty');
    }
  },

  setupConnections : function() {
    this.connect(this.node, 'externalChildrenAdded', dojo.hitch(this, '_updateNodes'));
  }
});

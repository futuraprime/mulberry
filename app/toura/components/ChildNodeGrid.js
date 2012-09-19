dojo.provide('toura.components.ChildNodeGrid');

dojo.require('mulberry.ui.BackgroundImage');
dojo.require('toura.components.ChildNodes');

dojo.declare('toura.components.ChildNodeGrid', toura.components.ChildNodes, {
  templateString : dojo.cache('toura.components', 'ChildNodeGrid/ChildNodeGrid.haml'),
  itemPhoneTemplate : Haml(dojo.cache('toura.components', 'ChildNodeGrid/ChildNodeGridPhoneItem.haml')),
  itemTabletTemplate : Haml(dojo.cache('toura.components', 'ChildNodeGrid/ChildNodeGridTabletItem.haml')),
  widgetsInTemplate : true,

  prepareData : function() {
    this.node.populateChildren();
    this._setupChildren();
  },

  adjustMarkup : function() {
    this.itemTemplate = this.isTablet ? this.itemTabletTemplate : this.itemPhoneTemplate;

    this._setupChildren();

    this.inherited(arguments);
  },

  _setupChildren : function() {
    // TODO: MAP should enforce this restraint
    this.children = dojo.filter(this.node.children || [], function(child) {
      return child.featuredImage !== undefined;
    });

    if (this.isTablet) {
      var num = this.children.length,
          size = num > 11 ? 'medium' : 'large';

      this['class'] = 'size-' + size;

      if (this.device.os === 'ios') { return ; }

      if (toura.components.ChildNodeGrid.placedCSS) { return; }

      var tpl = dojo.cache('toura.components.ChildNodeGrid', 'child-node-grid.css.tpl'),
          aspectRatio = 3/4,
          width = Math.floor(mulberry.app.UI.viewport.width / 2 - 18),
          height = Math.floor(width * aspectRatio * 1.40),
          imageHeight = width * aspectRatio,
          css = dojo.string.substitute(tpl, {
            width : width,
            height : height,
            imageHeight : imageHeight
          });

      dojo.place(css, document.querySelector('head'));
      toura.components.ChildNodeGrid.placedCSS = true;
    }
  }
});

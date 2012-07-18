dojo.provide('mulberry.containers.Region');

dojo.require('mulberry.containers._LayoutBox');
dojo.require('mulberry.ui.Scrollable');

(function() {

mulberry.components = mulberry.components || {};

var componentNamespaces = [ mulberry.components ];

dojo.declare('mulberry.containers.Region', mulberry.containers._LayoutBox, {
  templateString : dojo.cache('mulberry.containers', 'Region/Region.haml'),
  config : {},
  _scroller : null,

  postCreate : function() {
    this.inherited(arguments);

    this._placeComponents();
    this._placeRegions();
    this._setupScroller();

    this.connect(this.screen, 'startup', 'startup');
  },

  _setupScroller : function() {
    if (this.config.scrollable) {
      this._scroller = new mulberry.ui.Scrollable({}, this.pane);
      this.connect(this._scroller, 'onScrollStart', 'onScrollStart');
      this.connect(this._scroller, 'onScrollEnd', 'onScrollEnd');
    }
  },

  /*
   * If the region has scrollable=true, place the component into the .inner div
   * because iScroll needs that extra wrapper div
   */
  _placeComponents : function() {
    var placement = this.config.scrollable ? [this.inner, 'last'] : [this.pane, 'replace'] ;

    if (
      this.config.components &&
      this.config.components.length > 1 &&
      placement[0] === this.pane
    ) {
      console.error("WARNING: you're trying to place more than one component into a non-scrollable region. this will end badly.");
    }

    if (this.config.components && this.config.components.length) {
      dojo.forEach(this.config.components, function(componentName) {
        var klass;

        if (componentName.match(/^custom\./)) {
          klass = client.components[componentName.replace(/^custom\./, '')];
        } else {
          dojo.forEach(componentNamespaces, function(ns) {
            klass = ns[componentName];
          });
        }

        if (!klass) {
          console.error('No matching class found for', componentName);
        }

        var c = this.adopt(klass, {
          baseObj : this.baseObj,
          page : this.page,
          node : this.baseObj,
          device : this.device,
          screen : this.screen,
          region : this
        });

        c.placeAt(placement[0], placement[1]);
      }, this);
    }
  },

  _placeRegions : function() {
    var placement = this.config.scrollable ? [this.inner, 'last'] : [this.domNode];

    if (this.config.regions && this.config.regions.length) {
      if(!this.config.scrollable) {
        // not scrolling, don't need the pane
        // this replicates the old functionality exactly
        dojo.destroy(this.pane);
      }

      dojo.forEach(this.config.regions, function(region) {
        this.adopt(mulberry.containers.Region, {
          config : region,
          baseObj : this.baseObj,
          device : this.device,
          screen : this.screen,
          backgroundImage : this.backgroundImage
        }).placeAt(placement[0], placement[1]);
      }, this);
    }
  },

  numComponents : function() {
    return this._addedItems.length;
  },

  showElement : function(selector, ms) {
    ms = ms || '0ms';
    this._scroller.scroller.scrollToElement(selector, ms);
  },

  refreshScroller : function() {
    if (this._scroller) {
      this._scroller.refreshScroller();
    }
  },

  onScrollStart : function() {

  },

  onScrollEnd : function() {

  }
});

mulberry.registerComponentNamespace = function(ns) {
  componentNamespaces.push(ns);
};

}());

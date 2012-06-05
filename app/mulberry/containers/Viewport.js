dojo.provide('mulberry.containers.Viewport');

dojo.require('mulberry._View');
dojo.require('mulberry.app.Config');

dojo.declare('mulberry.containers.Viewport', mulberry._View, {
  templateString : dojo.cache('mulberry.containers', 'Viewport/Viewport.haml'),

  direction : 'next',

  postCreate : function() {
    this.connect(this.domNode, 'webkitTransitionEnd', '_onAnimationEnd');
  },

  _setNavDirectionAttr : function(dir) {
    this.direction = dir === 'back' ? 'prev' : 'next';
  },

  _setContentAttr : function(newPage) {
    if (mulberry.animating) { return; }

    var n = this.domNode,
        next = this.direction === 'next';

    this.direction = 'next'; // reset
    this.currentPage = newPage;

    if (n.children.length) {
      var startClass = next ? 'start-forward' : 'start-back';
      mulberry.animating = true;
      this.addClass('standard');
      this.addClass(startClass);
      newPage.placeAt(n, next ? 'last' : 'first');
      
      // CSS needs a tiny bit of time to catch up to the new transform
      // before we attach the transition animation
      setTimeout(dojo.hitch(this, function() {
        this.addClass('pre-slide');
        this.addClass(next ? 'slide-left' : 'slide-right');
      }), 25);
    } else {
      newPage.placeAt(n, 'last');
      this._onAnimationEnd();
    }

    setTimeout(dojo.hitch(this, function() {
      // sometimes webkitAnimationEnd doesn't fire :/
      if (mulberry.animating) {
        this._onAnimationEnd();
      }
    }), 650);
  },

  _cleanupOldPage : function() {
    var pages = document.querySelectorAll('ol.viewport > li');

    dojo.forEach(pages, function(page) {
      if (this.currentPage.domNode !== page) {
        dojo.destroy(page);

        var widget = dijit.byNode(page);

        if (widget) { widget.destroy(); }
      }
    }, this);
    
    this.removeClass(['slide-left', 'slide-right', 'pre-slide', 'start-forward', 'start-back', 'standard']);
    
    setTimeout(dojo.hitch(this, function() {
      this.addClass('standard');
    }), 200);
  },

  _onAnimationEnd : function() {
    this._cleanupOldPage();
    mulberry.animating = false;
    dojo.publish('/page/transition/end');
  }
});

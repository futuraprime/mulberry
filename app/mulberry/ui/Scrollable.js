dojo.provide('mulberry.ui.Scrollable');

dojo.require('dijit._Widget');
dojo.require('vendor.iscroll');

dojo.declare('mulberry.ui.Scrollable', dijit._Widget, {
  postCreate : function() {
    this.inherited(arguments);

    this.subscribe('/page/transition/end', '_makeScroller');
    this.subscribe('/window/resize', 'refreshScroller');
    this.subscribe('/fontsize', 'refreshScroller');
    this.subscribe('/content/update', function() {
      this.refreshScroller();
      // if (this.scroller) {
      //   this.scroller.scrollTo(0, 0);
      // }
    });

    dojo.addClass(this.domNode, 'scrollable');
  },

  _makeScroller : function() {
    if (this.domNode.children.length > 1) {
      console.error('mulberry.ui.Scrollable::_makeScroller: More than one child element. Only the first one will be scrollable. Probably not what you want!');
    }

    this.scroller = new iScroll(this.domNode, {
      vScrollbar: false,
      onScrollStart : dojo.hitch(this, 'onScrollStart'),
      onScrollEnd : dojo.hitch(this, 'onScrollEnd')
    });

    this._resetSnapshot();
    this.scroller.refresh();
  },

  makeScroller : function() {
    if (!this.scroller) {
      this._makeScroller();
    }
  },

  destroy : function() {
    if (this.scroller) {
      this.scroller.destroy();
    }
    this.inherited(arguments);
  },

  refreshScroller : function() {
    if (this.scroller) {
      this.scroller.refresh();
      console.log(this.scroller, this.snapshot);
      this.scroller.scrollTo(0, this.snapshot.y);

      clearTimeout(this._snapshotTimeout);
      this._snapshotTimeout = setTimeout(dojo.hitch(this, function() {
        this._resetSnapshot();
      }), 1000);
    }
  },

  _getReadingTarget : function(startPos, element) {
    if (!this.scroller) { return; }
    var pos = startPos || dojo.position(this.scroller.wrapper),
        offsetX = 25, offsetY = 5;
        topEle = element || (document.elementFromPoint(pos.x + offsetX, pos.y + offsetY)),
        topElePos = dojo.position(topEle),
        fnCache = null;
    console.log(topEle, topElePos, topElePos.y >= pos.y);
    if (topEle.id == "splash") {
      // TOO SOON
      fnCache = mulberry.app.UI.hideSplash;
      mulberry.app.UI.hideSplash = dojo.hitch(this, function() {
        fnCache();
        this._getReadingTarget(pos, topEle);
      });
    }
    if (topElePos.y >= pos.y) {
      return topEle;
    }
    var nextEle = topEle.nextSibling ? topEle.nextSibling : topEle.parentNode;

    if (nextEle === this.scroller.scroller) {
      return;
    }

    // return this._getReadingTarget(pos, nextEle);
  },

  _resetSnapshot : function() {
    this.snapshot = {
        y : this.scroller.y,
        maxScrollY : this.scroller.maxScrollY,
        scrollerH : this.scroller.scrollerH,
        wrapperH : this.scroller.wrapperH,
        target : this._getReadingTarget()
      };
    clearTimeout(this._snapshotTimeout);
    this._snapshotTimeout = setTimeout(dojo.hitch(this, function() {
      this._resetSnapshot();
    }), 5000);
  },

  onScrollStart : function() {

  },

  onScrollEnd : function() {

  }
});


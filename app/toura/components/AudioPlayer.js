dojo.provide('toura.components.AudioPlayer');

dojo.require('toura.app.PhoneGap');
dojo.require('toura.components._MediaPlayer');

dojo.declare('toura.components.AudioPlayer', toura.components._MediaPlayer, {
  templateString : dojo.cache('toura.components', 'AudioPlayer/AudioPlayer.haml'),
  
  playerType : 'audio',
  isPlaying : false,
  playerSettings : {
    preload : 'auto',
    controls : true,
    autobuffer : true
  },
  ui: {},

  prepareData : function() {
    this.medias = this.node.audios || [];
    this.inherited(arguments);
  },

  setupConnections : function() {
    this.inherited(arguments);

    if (!this.useHtml5Player) {
      this.connect(this.controller, 'click', '_handleControllerClick');
    }
  },
  
  _formatTime : function(t) {
    t = parseInt(t, 10);
    var minutes = Math.floor(t/60, 10),
      seconds   = t - minutes * 60;
    return minutes + ':' + (seconds > 9 ? seconds : '0' + seconds); 
  },
  
  _setupPlayer : function() {
    this.inherited(arguments);
    this._setupInterface();
  },
  
  _setupInterface : function () {
    // TODO: make less jQueryish
    this.ui     = {
      main : dojo.query('.ui', this.domNode)[0],       // nodeList[0] is the (first) raw dom node
      toggle : dojo.query('.playtoggle', this.ui.main)[0],
      handle : dojo.query('.handle', this.ui.main)[0],
      remaining : dojo.query('.remaining', this.ui.main)[0],
    }
    
    // the player needs to exist on the page, but shouldn't be visible to the user
    if (this.useHtml5Player) {
      dojo.style(this.player, { 'display': 'none' });
    }
    
    this.connect(this.player, 'timeupdate', this._updateRemainingTime);
    this.connect(this.ui.toggle, 'onclick', this._handleControllerClick);
  },
  
  _updateRemainingTime : function() {
    var remains   = parseInt(this.player.duration - this.player.currentTime, 10),
      position    = (this.player.currentTime / this.player.duration) * 100;
    
    this.ui.remaining.innerHTML = this._formatTime(this.player.currentTime) + ' / ' + this._formatTime(this.player.duration);
    dojo.style(this.ui.handle, { 'left' : position + '%' });
  },

  _handleControllerClick : function() {
    if (this.isPlaying) {
      this._pause();
      this.isPlaying = false;
      this.removeClass('playing');
    } else {
      this._play();
      this.isPlaying = true;
      this.addClass('playing');
    }
  },

  _play : function(media) {
    this.inherited(arguments);

    if (this.useHtml5Player) { return; }

    var pg = toura.app.PhoneGap;
    pg.audio.destroy();
    pg.audio.play(this.media.url);
  },

  _pause : function() {
    this.inherited(arguments);

    if (!this.useHtml5Player) {
      toura.app.PhoneGap.audio.stop();
    }
  },

  teardown : function() {
    if (!this.useHtml5Player) {
      // we used the phonegap player
      toura.app.PhoneGap.audio.destroy();
    }
  }

});

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
    // TODO: make less jQueryish
    var ui      = dojo.query('.ui', this.domNode)[0],       // nodeList[0] is the (first) raw dom node
      toggle    = dojo.query('.playtoggle', ui)[0],
      handle    = dojo.query('.handle', ui)[0],
      remaining = dojo.query('.remaining', ui)[0],
      
      _updateRemainingTime = dojo.hitch(this, function() {
        var remains   = parseInt(this.player.duration - this.player.currentTime, 10),
          position    = (this.player.currentTime / this.player.duration) * 100;
        
        remaining.innerHTML = this._formatTime(this.player.currentTime) + ' / ' + this._formatTime(this.player.duration);
        dojo.style(handle, { 'left' : position + '%' });
      });
    
    dojo.connect(this.player, 'timeupdate', _updateRemainingTime);
  },

  _handleControllerClick : function() {
    if (this.useHtml5Player) { return; }

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

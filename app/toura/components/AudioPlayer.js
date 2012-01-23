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

  _handleControllerClick : function() {
    if (this.useHtml5Player) { return; }

    if (this.isPlaying) {
      this._pause();
    } else {
      this._play();
    }
  },

  _play : function(media) {
    this.inherited(arguments);

    this.isPlaying = true;
    this.addClass('playing');

    if (this.useHtml5Player) { return; }

    var pg = toura.app.PhoneGap;
    pg.audio.destroy();
    pg.audio.play(this.media.url);
    
    toura.log("log!", this.duration(), this.getCurrentTime());
  },

  _pause : function() {
    this.inherited(arguments);

    this.isPlaying = false;
    this.removeClass('playing');

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

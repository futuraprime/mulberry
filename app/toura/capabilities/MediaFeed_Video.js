dojo.provide('toura.capabilities.MediaFeed_Video');

dojo.require('mulberry._Capability');

dojo.declare('toura.capabilities.MediaFeed_Video', mulberry._Capability, {
  requirements : {
    feedItemDetail : 'FeedItemDetail',
    videoPlayer : 'VideoPlayer'
  },
  
  handlers: {
    'video/mp4': function() {
      this.videoPlayer.media = { 'url': this.baseObj.media.url };
      this.page.showScreen('video');
    }
  },

  init : function() {
    var media = this.baseObj.media;
    
    if (media && this.handlers[media.type]) {
      dojo.hitch(this, this.handlers[media.type])();
    } else {
      this.page.showScreen('index');
    }
  }
});

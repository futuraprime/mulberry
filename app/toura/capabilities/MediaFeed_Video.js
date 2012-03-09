dojo.provide('toura.capabilities.MediaFeed_Video');

dojo.require('mulberry._Capability');

dojo.declare('toura.capabilities.MediaFeed_Video', mulberry._Capability, {
  requirements : {
    feedItemDetail : 'FeedItemDetail',
    videoPlayer : 'VideoPlayer'
  },

  init : function() {
    if (this.baseObj.media) {
      
      switch(this.baseObj.media.type) {
        case "video/mp4":
          this.page.showScreen('video');
          this.videoPlayer.media = { url: this.baseObj.media.url }
        break;
      }
      
    } else {
      this.page.showScreen('index');
    }
  }
});

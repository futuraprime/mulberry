dojo.provide('toura.capabilities.MediaFeed_Video');

dojo.require('mulberry._Capability');

dojo.declare('toura.capabilities.MediaFeed_Video', mulberry._Capability, {
  requirements : {
    feedItemDetail : 'FeedItemDetail',
    videoPlayer : 'VideoPlayer'
  },

  init : function() {
    this.videoPlayer._play({
      url: videoUrl
    });
  }
});

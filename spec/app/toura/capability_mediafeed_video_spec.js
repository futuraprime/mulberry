describe("feed item detail component", function() {
  var c, C, f, t, feed, feedItem, videoFeedItem, videoFeed;

  beforeEach(function() {
    // TODO: require page stuff...
    dojo.require('mulberry.app.PageFactory');
    dojo.require('mulberry._PageDef');
    dojo.require('toura.components.VideoPlayer');
    dojo.require('toura.components.FeedItemDetail');
    dojo.require('toura.capabilities.MediaFeed_Video');
    
    f = f || new mulberry.app.PageFactory({ type : 'fake', os : 'fake' });
    
    mulberry.pageDef("feed-item", {
      type : 'detail',
      capabilities : [
        'MediaFeed_Video'
      ],
      screens : [
        {
          'name' : 'index',
          'regions' : [
            {
              'components' : [
                "FeedItemDetail"
              ]
            }
          ]
        },
        {
          'name' : 'video',
          'regions' : [
            {
              'components' : [
                "VideoPlayer",
                "FeedItemDetail"
              ]
            }
          ]
        }
      ]
    });

    t = dojo.byId('test');

    feedItem = {
      title : 'Feed Item Fixture',
      body : '<p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.',
      url : '/feed/fake-feed/item/0',
      link : 'http://toura.com',
      pubDate : new Date(),
      image : { url : 'http://24.media.tumblr.com/tumblr_lmx6fb2nH51qlyu3ro1_500.png' },
      author : null,
      id : 'fake-id',
      name : 'Feed Item Fixture',
      feedName : 'Fixture Feed',
      type : 'feedItem'
    };

    feed = {
      getItem : function() {
        return feedItem;
      }
    };
    
    videoFeedItem = dojo.clone(feedItem);
    videoFeedItem.content = {
      type : 'video/mp4',
      url : 'http://av.vimeo.com/01780/039/24113681.web?token=1331829715_b4a96dbd1013cbcb9d316abbce7fbc0e'
    };
    
    videoFeed = {
      getItem : function() {
        return videoFeedItem;
      }
    }

    C = function(config) {
      
      // TODO: set up an actual whole page somehow...?
      node = dojo.clone(config.node);
      node.pageDef = "feed-item";
      debugger;
      return new f.createPage(node).placeAt(t);
    };
    
    if (c) { c.destroy(); }
  });
  
  it("should use the standard screen for a standard feed", function() {
    c = C({ node: feedItem });
    
    expect(dojo.query('.screen.index').hasClass('hidden')).toBeFalsy();
    expect(dojo.query('.screen.video').hasClass('hidden')).toBeTruthy();
  });
  
  it("should use the video screen if there is a video attached", function() {
    c = C({ node: videoFeedItem });
    
    expect(dojo.query('.screen.video').hasClass('hidden')).toBeFalsy();
    expect(dojo.query('.screen.index').hasClass('hidden')).toBeTruthy();
  });
    
});
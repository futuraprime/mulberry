describe("video player component", function() {
  var t, C,
      config = {
        node : {
          videos : [
            {
              "video" : {
                "_reference": "video-baby_owls"
              }
            },
            {
              "caption": {
                "_reference": "text-asset-baby_owls"
              }
            }
          ]
        }
      },
      feed_media = {
        url: 'http://av.vimeo.com/01780/039/24113681.web?token=1331829715_b4a96dbd1013cbcb9d316abbce7fbc0e'
      };

  beforeEach(function() {
    dojo.require('toura.components.VideoPlayer');

    C = toura.components.VideoPlayer;

    t = dojo.byId('test');
    dojo.empty(t);
  });

  it("should create a video player", function() {
    var c = new C(config).placeAt(t);
    expect(t.querySelector(getRootSelector(c))).toBeTruthy();
  });
  
  it("should play media it's given", function() {
    var c = new C(config).placeAt(t);
    c.setMedia(feed_media);
    
    expect(c.media).toEqual(feed_media);
  });

  it("should destroy the component when it doesn't have any videos", function() {
    var config = {
          node : {
            videos : []
          }
        },
        c = new C(config).placeAt(t);

    c.startup();
    expect(t.querySelector('.component.video-player')).toBeFalsy();
  });
});

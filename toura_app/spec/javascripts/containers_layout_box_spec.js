describe("containers _LayoutBox", function() {
  var c, C, t, flag;

  beforeEach(function() {
    dojo.require('toura.containers._LayoutBox');

    if (c) { c.destroy(); }

    C = function(config) {
      return new toura.containers._LayoutBox(config || {}).placeAt(t);
    };

    t = dojo.byId('test');

    dojo.declare('toura.components.FakeComponent', [], {
      placeAt : function() {
        flag = true;
      }
    });

    flag = false;
  });

  it("should create a layout box on the page", function() {
    c = C({
      config : {}
    });

    expect(t.querySelector('.layout-box')).toBeTruthy();
  });

  it("should override layout settings correctly", function() {
    c = C({
      config : {
        containerType : 'fake'
      }
    });

    var el = t.querySelector('.layout-box');
    expect(dojo.hasClass(el, 'fake-container')).toBeTruthy();
    expect(dojo.hasClass(el, 'size-flex')).toBeTruthy();
    expect(dojo.hasClass(el, 'layout-normal')).toBeTruthy();
  });

  it("should add a class if one is specified in the className property", function() {
    c = C({
      config : {
        className : 'fake'
      }
    });

    var el = t.querySelector('.layout-box');
    expect(dojo.hasClass(el, 'fake')).toBeTruthy();
  });

  it("should add 'row-container' and 'column-container' classes to regions depending on what the child regions are", function() {
    c = C({
      config : {
        regions : [
          { type: 'row'},
          { type: 'row'}
        ]
      }
    });

    expect(dojo.hasClass(c.domNode, ('.row-container')));

    c = C({
      config : {
        regions : [
          { type: 'column'},
          { type: 'column'}
        ]
      }
    });

    expect(dojo.hasClass(c.domNode, ('.column-container')));
  });

  it("should throw an exception if it contains a column and a row", function() {
    expect(function() {
      C({
        config : {
          regions : [
            { type: 'row'},
            { type: 'column'}
          ]
        }
      });
    }).toThrow();
  });

  it("should throw an exception if the child regions don't specify their type", function() {
    expect(function() {
      C({
        config : {
          regions : [
            { },
            { }
          ]
        }
      });
    }).toThrow();
  });

  it("should throw an exception unless all child regions specify their type", function() {
    expect(function() {
      C({
        config : {
          regions : [
            { type : 'row'},
            { }
          ]
        }
      });
    }).toThrow();
  });

  it("should throw an exception for unknown types ", function() {
    expect(function() {
      C({
        config : {
          regions : [
            { type : 'fake'},
            { type : 'fake'}
          ]
        }
      });
    }).toThrow();
  });
});

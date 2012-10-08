describe("linked list component", function() {
  var store, mockdata,
      test, C, config;

  beforeEach(function() {
    dojo.require('mulberry.app.UI');
    dojo.require('mulberry.components._LinkedList');
    dojo.require('dojo.store.Memory');
    dojo.require('dojo.store.Observable');

    mockdata = [
      {'id' : 1, 'foo' : 'bar', 'spam' : 'eggs' },
      {'id' : 2, 'foo' : 'baz', 'spam' : 'bacon' },
      {'id' : 3, 'foo' : 'buzz', 'spam' : 'eggs' },
      {'id' : 4, 'foo' : 'biz', 'spam' : 'eggs' },
      {'id' : 5, 'foo' : 'bor', 'spam' : 'bacon' }
    ];

    store = dojo.store.Observable(new dojo.store.Memory({
      data : mockdata
    }));

    C = mulberry.components._LinkedList;

    test = dojo.byId('test');
    dojo.empty(test);

    mulberry.app.UI.hasTouch = false;

    config = {
      templateString : '%ul',
      itemTemplate : Haml('%li =foo')
    };
  });

  describe("item manipulation", function() {
    var c;

    beforeEach(function() {
      c = new C(config).placeAt(test);
    });

    it("should insert an item", function() {
      var l, element;

      element = c._addItem({'foo' : 'bar'});

      expect(test.innerHTML.match('bar')).toBeTruthy();

      l = test.children[0].children.length;
      expect(test.children[0].children[l - 1].outerHTML).toBe(element);
    });

    it("should insert an item at an index", function() {
      var items = [
        {'foo' : 'bar'},
        {'foo' : 'baz'},
        {'foo' : 'biz'}
      ], i, element;

      for (i = items.length - 1; i >= 0; i--) {
        c._addItem(items[i]);
      }

      element = c._addItem({'foo' : 'boz'}, 1);

      expect(test.children[0].children[1].outerHTML).toBe(element);
    });

    it("should drop an item at a given index", function() {
      var items = [
        {'foo' : 'bar'},
        {'foo' : 'baz'},
        {'foo' : 'biz'}
      ], i;

      for (i = items.length - 1; i >= 0; i--) {
        c._addItem(items[i]);
      }

      c._dropItem(1);

      expect(test.innerHTML.match('baz')).toBeFalsy();
      expect(test.children[0].children.length).toBe(2);
    });
  });

  describe("observing the store", function() {
    var c, results;

    beforeEach(function() {
      c = new C(config).placeAt(test);

      results = store.query();

      c.setStore(results);
    });

    it("should populate the component based on a store", function() {
      expect(c.storeData.length).toEqual(mockdata.length);
      expect(test.innerHTML.match('buzz')).toBeTruthy();
    });

    it("should reset the component for a new store", function() {
      var innerResults = store.query({'spam' : 'eggs'});

      c.setStore(innerResults);

      expect(test.innerHTML.match('bor')).toBeFalsy();
      expect(test.innerHTML.match('buzz')).toBeTruthy();
    });

    it("should add an item when one is added to the store", function() {
      store.put({'id' : 6, 'foo' : 'bap', 'spam' : 'bacon'});

      expect(test.innerHTML.match('bap')).toBeTruthy();
      expect(test.children[0].children.length).toBe(6);
    });

    it("should remove an item when one is taken out of the store", function() {
      store.remove(2);

      expect(test.innerHTML.match('baz')).toBeFalsy();
      expect(test.children[0].children.length).toBe(4);
    });

    it("should update an item when one is changed in the store", function() {
      store.put({'id' : 4, 'foo' : 'bap', 'spam' : 'bacon'});

      expect(test.innerHTML.match('bap')).toBeTruthy();
      expect(test.children[0].children.length).toBe(5);
    });
  });
});

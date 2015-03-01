describe("Protobone.Collection", function() {
    describe("Basic", function() {
        it("defines the Protobone.Collection class", function() {
            expect(Protobone.Collection).toBeDefined();
        });
    });

    describe("Event Bubbling", function(){
        it("fires an update event when a model updates", function() {
            var c = new Protobone.Collection();
            var m1 = new Protobone.Model();
            var m2 = new Protobone.Model();
            var listener = jasmine.createSpy('on');
            c.add([m1,m2]);
            c.on('updated',listener);
            m1.set({'a':'a','b':'b'});
            expect(listener).toHaveBeenCalledWith(m1,{'a':'a','b':'b'},{'a':undefined,'b':undefined});
            m2.set('a','b');
            expect(listener).toHaveBeenCalledWith(m2,{'a':'b'},{'a':undefined});
            expect(listener.calls.count()).toEqual(2);
        });
    });
});

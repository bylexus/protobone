describe("Prototype.Model", function() {
    describe("#on", function() {
        it("exists", function() {
            expect(Prototype.Model.prototype.on).toEqual(jasmine.any(Function));
        });

        it("returns itself (this, fluent interface)", function() {
            var m = new Prototype.Model();
            var ret = m.on('test',function(){});
            expect(ret).toEqual(m);
        });

        it("adds the callback to the internal listener array", function() {
            var m = new Prototype.Model();
            var f = function(){};
            var f2 = function(){};
            m.on('test',f);
            m.on('test2',f2);
            m.on('test',f);
            expect(m._listeners.test[0]).toEqual(f);
            expect(m._listeners.test[1]).toEqual(f);
            expect(m._listeners.test2[0]).toEqual(f2);
        });
    });



    describe("#off", function() {
        it("exists", function() {
            expect(Prototype.Model.prototype.off).toEqual(jasmine.any(Function));
        });

        it("returns itself (this, fluent interface)", function() {
            var m = new Prototype.Model();
            var ret = m.off('test');
            expect(ret).toEqual(m);
        });

        it("removes a specific event listener (also when registered multiple times)", function() {
            var m = new Prototype.Model();
            var f = function(){};
            var f2 = function(){};
            m.on('test',f);
            m.on('test',f2);
            m.on('test',f);
            m.on('test2',f2);
            m.off('test',f);
            expect(m._listeners.test.length).toEqual(1);
            expect(m._listeners.test[0]).toEqual(f2);
            expect(m._listeners.test2[0]).toEqual(f2);
        });

        it("removes all event listeners for a given event", function() {
            var m = new Prototype.Model();
            var f = function(){};
            var f2 = function(){};
            m.on('test',f);
            m.on('test',f2);
            m.on('test',f);
            m.on('test2',f2);
            m.off('test');
            expect(m._listeners.test.length).toEqual(0);
            expect(m._listeners.test2[0]).toEqual(f2);
        });
    });


    describe("#fireEvent", function() {
        it("exists", function() {
            expect(Prototype.Model.prototype.fireEvent).toEqual(jasmine.any(Function));
        });

        it("calls the given handlers", function() {
            var m = new Prototype.Model();
            var f = jasmine.createSpy('f1');
            var f2 = jasmine.createSpy('f2');
            var f3 = jasmine.createSpy('f3');
            m.on('test',f);
            m.on('test',f2);
            m.on('test2',f2);
            m.on('test2',f3);
            m.fireEvent('eve1','some','data');
            m.fireEvent('test','some','data');
            expect(f.calls.count()).toEqual(1);
            expect(f2.calls.count()).toEqual(1);
            expect(f3.calls.count()).toEqual(0);
            expect(f).toHaveBeenCalledWith('some','data');
            expect(f2).toHaveBeenCalledWith('some','data');
        });
    });
});

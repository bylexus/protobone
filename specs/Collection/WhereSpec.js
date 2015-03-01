describe("Protobone.Collection", function() {
    describe("#where", function() {
        it("exists", function() {
            expect(Protobone.Collection.prototype.where).toEqual(jasmine.any(Function));
        });

        it("returns the correct models for the given predicates", function(){
            var m1 = new Protobone.Model({id:1,a:'a',b:'a'});
            var m2 = new Protobone.Model({id:2,a:'a',b:'b'});
            var m3 = new Protobone.Model({id:3,a:'b',b:'a'});
            var m4 = new Protobone.Model({id:4,a:'b',b:'b'});
            var m5 = new Protobone.Model({id:5,a:'a',b:'a'});
            var m6 = new Protobone.Model({id:6,a:'a',b:'b'});
            var c = new Protobone.Collection([m2,m1,m3,m5,m4,m6]);

            spyOn(c,'filter').and.returnValue([m2,m6]);

            var res = c.where({a:'a',b:'b'});
            expect(c.filter.calls.count()).toEqual(1);
            expect(res).toEqual([m2,m6]);
            expect(c.filter).toHaveBeenCalledWith(jasmine.any(Function));
            expect(c.filter.calls.argsFor(0)[0](m1)).toEqual(false);
            expect(c.filter.calls.argsFor(0)[0](m2)).toEqual(true);
            expect(c.filter.calls.argsFor(0)[0](m3)).toEqual(false);
            expect(c.filter.calls.argsFor(0)[0](m4)).toEqual(false);
            expect(c.filter.calls.argsFor(0)[0](m5)).toEqual(false);
            expect(c.filter.calls.argsFor(0)[0](m6)).toEqual(true);
        });

        it("returns an empty array if no model could be found", function(){
            var m1 = new Protobone.Model({id:1,a:'a',b:'a'});
            var m2 = new Protobone.Model({id:2,a:'a',b:'b'});
            var m3 = new Protobone.Model({id:3,a:'b',b:'a'});
            var m4 = new Protobone.Model({id:4,a:'b',b:'b'});
            var m5 = new Protobone.Model({id:5,a:'a',b:'a'});
            var m6 = new Protobone.Model({id:6,a:'a',b:'b'});
            var c = new Protobone.Collection([m2,m1,m3,m5,m4,m6]);

            spyOn(c,'filter').and.returnValue([]);

            var res = c.where({a:'c',b:'b'});
            expect(c.filter.calls.count()).toEqual(1);
            expect(res).toEqual([]);
            expect(c.filter.calls.argsFor(0)[0](m1)).toEqual(false);
            expect(c.filter.calls.argsFor(0)[0](m2)).toEqual(false);
            expect(c.filter.calls.argsFor(0)[0](m3)).toEqual(false);
            expect(c.filter.calls.argsFor(0)[0](m4)).toEqual(false);
            expect(c.filter.calls.argsFor(0)[0](m5)).toEqual(false);
            expect(c.filter.calls.argsFor(0)[0](m6)).toEqual(false);
        });
    });
});

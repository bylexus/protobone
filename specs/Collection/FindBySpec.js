describe("Protobone.Collection", function() {

    describe("#findWhere", function() {
        it("exists", function() {
            expect(Protobone.Collection.prototype.findWhere).toEqual(jasmine.any(Function));
        });

        it("finds a (single) model by a specific set of properties, or return null", function (){
            var m1 = new Protobone.Model({id:1,a:'a',b:'a'});
            var m2 = new Protobone.Model({id:2,a:'a',b:'b'});
            var m3 = new Protobone.Model({id:3,a:'b',b:'a'});
            var m4 = new Protobone.Model({id:4,a:'b',b:'b'});
            var m5 = new Protobone.Model({id:5,a:'a',b:'a'});
            var m6 = new Protobone.Model({id:6,a:'b',b:'a'});
            var c = new Protobone.Collection([m2,m1,m3,m5,m4,m6]);

            var res = c.findWhere({a:'b',b:'a'});
            expect(res).toEqual(m3);

            res = c.findWhere({a:'b',b:'c'});
            expect(res).toEqual(null);
        });
    });

        describe("#findBy", function() {
        it("exists", function() {
            expect(Protobone.Collection.prototype.findBy).toEqual(jasmine.any(Function));
        });

        it("returns null if no model could be found matching the property/value", function (){
            var m1 = new Protobone.Model({id:1,a:'a',b:'a'});
            var m2 = new Protobone.Model({id:2,a:'a',b:'b'});
            var c = new Protobone.Collection([m1,m2]);

            spyOn(c,'findWhere').and.returnValue(null);
            var res = c.findBy('b','c');

            expect(res).toEqual(null);
            expect(c.findWhere).toHaveBeenCalledWith({b:'c'});
            expect(c.findWhere.calls.count()).toEqual(1);
        });

        it("finds a (single) model by a specific property", function (){
            var m1 = new Protobone.Model({id:1,a:'a',b:'a'});
            var m2 = new Protobone.Model({id:2,a:'a',b:'b'});
            var m3 = new Protobone.Model({id:3,a:'b',b:'a'});
            var m4 = new Protobone.Model({id:4,a:'b',b:'b'});
            var m5 = new Protobone.Model({id:5,a:'a',b:'a'});
            var m6 = new Protobone.Model({id:6,a:'b',b:'a'});
            var c = new Protobone.Collection([m1,m2,m3,m5,m4,m6]);

            spyOn(c,'findWhere').and.returnValue(m2);
            var res = c.findBy('b','b');

            expect(res).toEqual(m2);
            expect(c.findWhere).toHaveBeenCalledWith({b:'b'});
            expect(c.findWhere.calls.count()).toEqual(1);
        });
    });
});

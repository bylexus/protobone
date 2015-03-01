describe("Protobone.Collection", function() {

    describe("#at", function() {
        it("exists", function() {
            expect(Protobone.Collection.prototype.at).toEqual(jasmine.any(Function));
        });

        it("returns the correct model for an index", function() {
            var m1 = new Protobone.Model({id: 1,a:'alex'});
            var m2 = new Protobone.Model({id: 2,a:'alex'});
            var m3 = new Protobone.Model({id: 3,a:'barbara'});
            var c = new Protobone.Collection();
            c.add([m2,m1,m3]);
            expect(c.at(0)).toEqual(m2);
            expect(c.at(1)).toEqual(m1);
            expect(c.at(2)).toEqual(m3);
        });

        it("returns null for a wrong index", function() {
            var m1 = new Protobone.Model({id: 1,a:'alex'});
            var m2 = new Protobone.Model({id: 2,a:'alex'});
            var m3 = new Protobone.Model({id: 3,a:'barbara'});
            var c = new Protobone.Collection();
            c.add([m2,m1,m3]);
            expect(c.at(-1)).toEqual(null);
            expect(c.at(3)).toEqual(null);
        });
    });
});

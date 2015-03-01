describe("Protobone.Collection", function() {

    describe("#get", function() {
        it("exists", function() {
            expect(Protobone.Collection.prototype.get).toEqual(jasmine.any(Function));
        });

        it("returns the model if found, null otherwise", function() {
            var M = Class.create(Protobone.Model, {
                idAttribute: 'myId'
            });
            var m = new M({myId: 5});
            var c = new Protobone.Collection();
            c.model = M;
            spyOn(c,'findBy').and.callFake(function(prop,id) {
                if (id === 5) {
                    return m;
                } else return null;
            });

            c.add(m);
            var res = c.get(4);
            expect(res).toEqual(null);
            expect(c.findBy).toHaveBeenCalledWith('myId',4);
            res = c.get(5);
            expect(res).toEqual(m);
            expect(c.findBy).toHaveBeenCalledWith('myId',5);
        });
    });
});

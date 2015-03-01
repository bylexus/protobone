describe("Protobone.Collection", function() {

    describe("#forEach", function() {
        it("exists", function() {
            expect(Protobone.Collection.prototype.forEach).toEqual(jasmine.any(Function));
        });

        it("loops over all items and calls the specified callback in the correct context", function (){
            var m1 = new Protobone.Model({id: 1,a:'alex'});
            var m2 = new Protobone.Model({id: 2,a:'alex'});
            var m3 = new Protobone.Model({id: 3,a:'barbara'});
            var c = new Protobone.Collection();
            c.add([m2,m1,m3]);

            var cb = jasmine.createSpy('cb');
            c.forEach(cb);
            expect(cb.calls.count()).toEqual(3);
            expect(cb.calls.argsFor(0)).toEqual([m2,0]);
            expect(cb.calls.argsFor(1)).toEqual([m1,1]);
            expect(cb.calls.argsFor(2)).toEqual([m3,2]);

            expect(cb.calls.all()[0].object).toEqual(window);
            expect(cb.calls.all()[1].object).toEqual(window);
            expect(cb.calls.all()[2].object).toEqual(window);

            c.forEach(cb,cb);
            expect(cb.calls.count()).toEqual(6);
            expect(cb.calls.argsFor(3)).toEqual([m2,0]);
            expect(cb.calls.argsFor(4)).toEqual([m1,1]);
            expect(cb.calls.argsFor(5)).toEqual([m3,2]);

            expect(cb.calls.all()[3].object).toEqual(cb);
            expect(cb.calls.all()[4].object).toEqual(cb);
            expect(cb.calls.all()[5].object).toEqual(cb);
        });
    });
});

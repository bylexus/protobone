describe("Protobone.Collection", function() {
    describe("#indexOf", function() {
        it("exists", function() {
            expect(Protobone.Collection.prototype.indexOf).toEqual(jasmine.any(Function));
        });

        it("returns the correct index for a model in the collection", function(){
            var m1 = new Protobone.Model({id:1,a:'a'});
            var m2 = new Protobone.Model({id:2,a:'b'});
            var m3 = new Protobone.Model({id:3,a:'c'});
            var c = new Protobone.Collection([m2,m1,m3]);
            var res = c.indexOf(m1);
            expect(res).toEqual(1);
            res = c.indexOf(m2);
            expect(res).toEqual(0);
            res = c.indexOf(m3);
            expect(res).toEqual(2);
        });

        it("returns the -1 for a non-existing model", function(){
            var m1 = new Protobone.Model({id:1,a:'a'});
            var m2 = new Protobone.Model({id:2,a:'b'});
            var m3 = new Protobone.Model({id:3,a:'c'});
            var m4 = new Protobone.Model({id:3,a:'c'});
            var c = new Protobone.Collection([m2,m1,m3]);
            var res = c.indexOf(m4);
            expect(res).toEqual(-1);
        });
    });
});

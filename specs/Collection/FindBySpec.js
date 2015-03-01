describe("Protobone.Collection", function() {

    describe("#findBy", function() {
        it("exists", function() {
            expect(Protobone.Collection.prototype.findBy).toEqual(jasmine.any(Function));
        });

        it("finds a (single) model by a specific property, or return null", function (){
            var m1 = new Protobone.Model({id: 1,a:'alex'});
            var m2 = new Protobone.Model({id: 2,a:'alex'});
            var m3 = new Protobone.Model({id: 3,a:'barbara'});
            var c = new Protobone.Collection();
            spyOn(c,'forEach').and.callFake(function(callback){
                [m1,m2,m3].each(function(item){
                    return callback(item);
                });
            });
            c.add([m2,m1,m3]);

            var res = c.findBy('a','alex');
            expect(res).toEqual(m2);

            res = c.findBy('a','barbara');
            expect(res).toEqual(m3);

            res = c.findBy('a','foo');
            expect(res).toEqual(null);
        });
    });
});

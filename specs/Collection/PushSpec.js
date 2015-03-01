describe("Protobone.Collection", function() {
    describe("#push", function() {
        it("exists", function() {
            expect(Protobone.Collection.prototype.push).toEqual(jasmine.any(Function));
        });

        it("calls add()", function(){
            var c = new Protobone.Collection();
            spyOn(c,'add').and.returnValue(c);

            var ret = c.add({a:'a'});
            expect(c.add).toHaveBeenCalledWith({a:'a'});
            expect(ret).toEqual(c);
        });

    });
});

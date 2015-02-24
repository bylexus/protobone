describe("Protobone.Collection", function() {

    describe("#get", function() {
        it("exists", function() {
            expect(Protobone.Collection.prototype.get).toEqual(jasmine.any(Function));
        });
    });
});

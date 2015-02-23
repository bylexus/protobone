describe("Protobone.Collection", function() {
    describe("#length", function() {
        it("is 0 for a new collection", function() {
            var c = new Protobone.Collection();
            expect(c.length).toEqual(0);
        });

        it("returns the correct length after adding elements", function() {
            var c = new Protobone.Collection();
            c.add({name: 'alex'});
            expect(c.length).toEqual(1);
            c.add({name: 'alex'});
            c.add({name: 'alex'});
            expect(c.length).toEqual(3);
            c.add([{name: 'alex'},{name: 'alex'},{name: 'alex'}]);
            expect(c.length).toEqual(6);
        });


        it("returns the correct length after removing elements");
        it("returns the correct length after clearing the collection");
        it("returns the correct length after loading");

    });
});

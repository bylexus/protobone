describe("Protobone.Collection", function() {
    describe("#filter", function() {
        it("exists", function() {
            expect(Protobone.Collection.prototype.filter).toEqual(jasmine.any(Function));
        });

        it("returns the correct models for the given predicate", function(){
            var m1 = new Protobone.Model({id:1,a:'a',b:'a'});
            var m2 = new Protobone.Model({id:2,a:'a',b:'b'});
            var m3 = new Protobone.Model({id:3,a:'b',b:'a'});
            var m4 = new Protobone.Model({id:4,a:'b',b:'b'});
            var m5 = new Protobone.Model({id:5,a:'a',b:'a'});
            var m6 = new Protobone.Model({id:6,a:'a',b:'b'});
            var c = new Protobone.Collection([m2,m1,m3,m5,m4,m6]);

            var res = c.filter(function(item){
                return item.get('a') === 'a' && item.get('b') === 'b';
            });
            expect(res).toEqual([m2,m6]);
        });

        it("returns an empty array if no model could be found", function(){
            var m1 = new Protobone.Model({id:1,a:'a',b:'a'});
            var m2 = new Protobone.Model({id:2,a:'a',b:'b'});
            var c = new Protobone.Collection([m2,m1]);

            var res = c.filter(function(item){
                return item.get('a') === 'a' && item.get('b') === 'c';
            });
            expect(res).toEqual([]);
        });
    });
});

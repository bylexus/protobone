describe("Protobone.Collection", function() {
    describe("#remove", function() {
        it("exists", function() {
            expect(Protobone.Collection.prototype.remove).toEqual(jasmine.any(Function));
        });

        it("removes the given model(s) from the collection", function(){
            var m1 = new Protobone.Model({id:1,a:'a',b:'a'});
            var m2 = new Protobone.Model({id:2,a:'a',b:'b'});
            var m3 = new Protobone.Model({id:3,a:'b',b:'a'});
            var m4 = new Protobone.Model({id:1,a:'a',b:'a'});
            var m5 = new Protobone.Model({id:2,a:'a',b:'b'});
            var m6 = new Protobone.Model({id:3,a:'b',b:'a'});
            var c = new Protobone.Collection([m1,m2,m2,m3,m4,m4,m5,m6]);

            c.remove(m2);
            expect(c.models).toEqual([m1,m3,m4,m4,m5,m6]);

            c = new Protobone.Collection([m1,m2,m2,m3,m4,m4,m5,m6]);
            c.remove([m1,m2]);
            expect(c.models).toEqual([m3,m4,m4,m5,m6]);
        });

        it("updates the length property", function(){
            var m1 = new Protobone.Model({id:1,a:'a',b:'a'});
            var m2 = new Protobone.Model({id:2,a:'a',b:'b'});
            var m3 = new Protobone.Model({id:3,a:'b',b:'a'});
            var m4 = new Protobone.Model({id:1,a:'a',b:'a'});
            var m5 = new Protobone.Model({id:2,a:'a',b:'b'});
            var m6 = new Protobone.Model({id:3,a:'b',b:'a'});
            var c = new Protobone.Collection([m1,m2,m2,m3,m4,m4,m5,m6]);

            c.remove(m2);
            expect(c.length).toEqual(6);

            c = new Protobone.Collection([m1,m2,m2,m3,m4,m4,m5,m6]);
            c.remove([m1,m2]);
            expect(c.length).toEqual(5);
        });

        it("removes the 'updated' event handler on the model, and fires the 'removed' event", function(){
            var m1 = new Protobone.Model({id:1,a:'a',b:'a'});
            var c = new Protobone.Collection([m1]);
            spyOn(c,'fireEvent');
            m1.set('a','c');
            expect(c.fireEvent).toHaveBeenCalledWith('updated',m1,{a:'c'},{a:'a'});
            c.remove(m1);
            m1.set('a','d');
            expect(c.fireEvent).toHaveBeenCalledWith('removed',c,[m1]);
            expect(c.fireEvent.calls.count()).toEqual(2);
        });
    });

    describe("#removeAt", function() {
        it('calls at() and remove() to do the removal', function() {
            var c = new Protobone.Collection();
            var m = new Protobone.Model();
            spyOn(c,'at').and.returnValue(m);
            spyOn(c,'remove');
            c.removeAt(5);
            expect(c.at).toHaveBeenCalledWith(5);
            expect(c.remove).toHaveBeenCalledWith(m);
        });
    });
});

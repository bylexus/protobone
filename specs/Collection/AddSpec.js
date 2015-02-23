describe("Protobone.Collection", function() {
    describe("#constructor", function() {
        it("calls add with the given data", function() {
            spyOn(Protobone.Collection.prototype,'add');

            var c = new Protobone.Collection([{name: 'alex'}]);
            expect(c.add).toHaveBeenCalledWith([{name: 'alex'}]);
            expect(c.add.calls.count()).toEqual(1);
        });
    });



    describe("#add", function() {
        it("exists", function() {
            expect(Protobone.Collection.prototype.add).toEqual(jasmine.any(Function));
        });

        it("returns itself (this, fluent interface)", function() {
            var c = new Protobone.Collection();
            var ret = c.add();
            expect(ret).toEqual(c);
        });

        it ("does nothing if the given data are not objects", function() {
            var c = new Protobone.Collection();
            c.add();
            expect(c.models.length).toEqual(0);
            c.add('something');
            expect(c.models.length).toEqual(0);
            c.add([1,2,3,4]);
            expect(c.models.length).toEqual(0);
        });

        it("creates Protobone.Model instances when adding and store them in the models property", function() {
            var c = new Protobone.Collection();
            c.add([{name: 'alex'}, {name: 'barbara'}]);
            expect(c.models.length).toEqual(2);
            expect(c.models[0]).toEqual(jasmine.any(Protobone.Model));
            expect(c.models[1]).toEqual(jasmine.any(Protobone.Model));
            expect(c.models[0].get('name')).toEqual('alex');
            expect(c.models[1].get('name')).toEqual('barbara');

            c.add({name: 'clex'});
            c.add({name: 'dlex'});

            expect(c.models.length).toEqual(4);
            expect(c.models[2]).toEqual(jasmine.any(Protobone.Model));
            expect(c.models[3]).toEqual(jasmine.any(Protobone.Model));
            expect(c.models[2].get('name')).toEqual('clex');
            expect(c.models[3].get('name')).toEqual('dlex');
        });

        it("creates specific Model instances when adding on a Collection with defined model", function() {
            var Person = Class.create(Protobone.Model, {});
            var C = Class.create(Protobone.Collection, {
                model: Person
            });
            var c = new C();
            c.add([{name: 'alex'}, {name: 'barbara'}]);
            expect(c.models.length).toEqual(2);
            expect(c.models[0]).toEqual(jasmine.any(Person));
            expect(c.models[1]).toEqual(jasmine.any(Person));
            expect(c.models[0].get('name')).toEqual('alex');
            expect(c.models[1].get('name')).toEqual('barbara');
        });

        it ("adds given Model instances without transforming them into something else", function() {
            var Person = Class.create(Protobone.Model, {});
            var C = Class.create(Protobone.Collection, {
                model: Person
            });
            var c = new C();
            var p1 = new Person({name: 'alex'});
            var p2 = new Person({name: 'barbara'});
            c.add([p1,p2]);
            expect(c.models.length).toEqual(2);
            expect(c.models[0]).toEqual(p1);
            expect(c.models[1]).toEqual(p2);
            expect(c.models[0].get('name')).toEqual('alex');
            expect(c.models[1].get('name')).toEqual('barbara');
        });

        it ("fires an 'add' event for a single added model (added model as array in event handler)", function() {
            var c = new Protobone.Collection();
            var addFn = jasmine.createSpy('add');
            c.on('add',addFn);
            c.add({name: 'alex'});
            expect(addFn.calls.count()).toEqual(1);
            expect(addFn.calls.argsFor(0)[0]).toEqual(jasmine.any(Array));
            expect(addFn.calls.argsFor(0)[0][0]).toEqual(jasmine.any(Protobone.Model));
            expect(addFn.calls.argsFor(0)[1]).toEqual(c);

            c.add([{name: 'alex'},{name: 'blex'},{name: 'clex'}]);
            expect(addFn.calls.count()).toEqual(2);
            expect(addFn.calls.argsFor(1)[0]).toEqual(jasmine.any(Array));
            expect(addFn.calls.argsFor(1)[0].length).toEqual(3);
            expect(addFn.calls.argsFor(1)[0][0]).toEqual(jasmine.any(Protobone.Model));
            expect(addFn.calls.argsFor(1)[0][1]).toEqual(jasmine.any(Protobone.Model));
            expect(addFn.calls.argsFor(1)[0][2]).toEqual(jasmine.any(Protobone.Model));
            expect(addFn.calls.argsFor(1)[1]).toEqual(c);
        });
    });
});

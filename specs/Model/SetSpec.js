describe("Protobone.Model", function() {
	describe("#set", function() {
		it("exists", function() {
			expect(Protobone.Model.prototype.set).toEqual(jasmine.any(Function));
		});

		it("calls _setAttribute for a key/value", function() {
			var m = new Protobone.Model();
			spyOn(m,'_setAttribute');
			m.set('a',3);
			expect(m._setAttribute).toHaveBeenCalledWith('a',3,{},{});
			expect(m._setAttribute.calls.count()).toEqual(1);
		});

		it("calls _setAttribute for each key/value of an object", function() {
			var m = new Protobone.Model();
			spyOn(m,'_setAttribute');
			m.set({a: 1,b:2,c:'3'});
			expect(m._setAttribute).toHaveBeenCalledWith('a',1,jasmine.any(Object),jasmine.any(Object));
			expect(m._setAttribute).toHaveBeenCalledWith('b',2,jasmine.any(Object),jasmine.any(Object));
			expect(m._setAttribute).toHaveBeenCalledWith('c','3',jasmine.any(Object),jasmine.any(Object));
			expect(m._setAttribute.calls.count()).toEqual(3);
		});

		it("returns itself (this, fluent interface)", function() {
			var m = new Protobone.Model();
			var ret = m.set();
			expect(ret).toEqual(m);
		});
	});

	describe("#_setAttribute", function() {
		it("exists", function() {
			expect(Protobone.Model.prototype._setAttribute).toEqual(jasmine.any(Function));
		});

		it("stores the value internaly under the correct key", function() {
			var m = new Protobone.Model();
			m._setAttribute('one','two');
			expect(m._attributes.one).toEqual('two');
		});

		it("stores the id as value internaly under the correct key", function() {
			var m = new Protobone.Model();
			m._setAttribute('id',100);
			expect(m._attributes.id).toEqual(100);
		});

		it("does not define the data on the prototype (no data sharing)", function() {
			var a,b;
			a = new Protobone.Model();
			a._setAttribute('a',3);

			b = new Protobone.Model();
			expect(a._attributes).toEqual({'a':3});
			expect(b._attributes).toEqual({});
		});

		it("stores nothing if key is omitted", function() {
			var m = new Protobone.Model();
			m._setAttribute();
			expect(m._attributes).toEqual({});
		});

		it("returns itself (this, fluent interface)", function() {
			var m = new Protobone.Model();
			var ret = m._setAttribute();
			expect(ret).toEqual(m);
		});

		it("should set the ID on the object if the given attribute key is the idAttribute", function() {
			var M = Class.create(Protobone.Model,{
				idAttribute: 'myId'
			});
			var a = new M();
			spyOn(a,'setId');
			a._setAttribute('myId',5);
			expect(a.setId).toHaveBeenCalledWith(5);
		});
	});


});

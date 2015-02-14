describe("Prototype.Model", function() {
	describe("#set", function() {
		it("exists", function() {
			expect(Prototype.Model.prototype.set).toEqual(jasmine.any(Function));
		});

		it("calls setAttribute for a key/value", function() {
			var m = new Prototype.Model();
			spyOn(m,'setAttribute');
			m.set('a',3);
			expect(m.setAttribute).toHaveBeenCalledWith('a',3);
			expect(m.setAttribute.calls.count()).toEqual(1);
		});

		it("calls setAttribute for each key/value of an object", function() {
			var m = new Prototype.Model();
			spyOn(m,'setAttribute');
			m.set({a: 1,b:2,c:'3'});
			expect(m.setAttribute).toHaveBeenCalledWith('a',1);
			expect(m.setAttribute).toHaveBeenCalledWith('b',2);
			expect(m.setAttribute).toHaveBeenCalledWith('c','3');
			expect(m.setAttribute.calls.count()).toEqual(3);
		});

		it("returns itself (this, fluent interface)", function() {
			var m = new Prototype.Model();
			var ret = m.set();
			expect(ret).toEqual(m);
		});
	});

	describe("#setAttribute", function() {
		it("exists", function() {
			expect(Prototype.Model.prototype.setAttribute).toEqual(jasmine.any(Function));
		});

		it("stores the value internaly under the correct key", function() {
			var m = new Prototype.Model();
			m.setAttribute('one','two');
			expect(m._attributes.one).toEqual('two');
		});

		it("stores the id as value internaly under the correct key", function() {
			var m = new Prototype.Model();
			m.setAttribute('id',100);
			expect(m._attributes.id).toEqual(100);
		});

		it("does not define the data on the prototype (no data sharing)", function() {
			var a,b;
			a = new Prototype.Model();
			a.setAttribute('a',3);

			b = new Prototype.Model();
			expect(a._attributes).toEqual({'a':3});
			expect(b._attributes).toEqual({});
		});

		it("stores nothing if key is omitted", function() {
			var m = new Prototype.Model();
			m.setAttribute();
			expect(m._attributes).toEqual({});
		});

		it("returns itself (this, fluent interface)", function() {
			var m = new Prototype.Model();
			var ret = m.setAttribute();
			expect(ret).toEqual(m);
		});

		it("should set the ID on the object if the given attribute key is the idAttribute", function() {
			var M = Class.create(Prototype.Model,{
				idAttribute: 'myId'
			});
			var a = new M();
			spyOn(a,'setId');
			a.setAttribute('myId',5);
			expect(a.setId).toHaveBeenCalledWith(5);
		});
	});


});
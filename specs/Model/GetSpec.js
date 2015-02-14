describe("Prototype.Model", function() {
	describe("#get", function() {
		it("exists", function() {
			expect(Prototype.Model.prototype.get).toEqual(jasmine.any(Function));
		});

		it("returns a previous set value correctly", function() {
			var m = new Prototype.Model();
			spyOn(m,'hasAttribute').and.returnValue(true);
			m.set({a:'1','my-own':true});
			expect(m.get('a')).toEqual('1');
			expect(m.get('my-own')).toEqual(true);
			expect(m.hasAttribute).toHaveBeenCalledWith('a');
			expect(m.hasAttribute).toHaveBeenCalledWith('my-own');
		});

		it("returns null for a non-defined property", function() {
			var m = new Prototype.Model();
			spyOn(m,'hasAttribute').and.returnValue(false);
			expect(m.get('a')).toEqual(null);
			expect(m.hasAttribute).toHaveBeenCalledWith('a');
		});

		it("returns all properties if key is not given", function() {
			var m = new Prototype.Model();
			m.set('a',true);
			m.set({b:1,c:2});
			var res = m.get();
			expect(res).toEqual({a: true,b:1,c:2});
		});
	});

	describe("#hasAttribute", function(){
		it ("exists", function() {
			expect(Prototype.Model.prototype.hasAttribute).toEqual(jasmine.any(Function));
		});

		it ("returns true for a previously set attribute", function() {
			var m = new Prototype.Model();
			m.set('a',true);
			m.set({b:1,c:2});
			expect(m.hasAttribute('a')).toEqual(true);
			expect(m.hasAttribute('b')).toEqual(true);
			expect(m.hasAttribute('c')).toEqual(true);
		});
	});
});
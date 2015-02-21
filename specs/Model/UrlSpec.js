describe("Protobone.Model", function() {
	describe("#url", function() {
		it("exists", function() {
			expect(Protobone.Model.prototype.url).toEqual(jasmine.any(Function));
		});

		it("returns an url for a new model", function() {
			var M = Class.create(Protobone.Model, {
				urlRoot: '/MyModel'
			});
			var m = new M();
			expect(m.url()).toEqual('/MyModel');
		});

		it("returns an url for an existing model", function() {
			var M = Class.create(Protobone.Model, {
				urlRoot: '/MyModel'
			});
			var m = new M({id: 5});
			expect(m.url()).toEqual('/MyModel/5');
		});

		it("throws an exception if urlRoot is null", function() {
			var m = new Protobone.Model({id: 5});
			expect(m.url).toThrow();
		});
	});
});

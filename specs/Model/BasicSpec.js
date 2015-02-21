describe("Protobone.Model", function() {
	describe("Basic", function() {
		it("defines the Protobone.Model class", function() {
			expect(Protobone.Model).toBeDefined();
		});

		describe("#idAttribute", function() {
			it("defines an IdAttribute class var which defaults to 'id'", function() {
				expect(Protobone.Model.prototype.idAttribute).toEqual('id');
			});

			it("is not possible to override the idAttribute for an instance", function() {
				var m = new Protobone.Model({
					idAttribute: 'myId'
				});
				expect(m.idAttribute).toEqual('id');
				expect(Protobone.Model.prototype.idAttribute).toEqual('id');
			});

			it("is possible to override the idAttribute for the whole class", function() {
				var M2 = Class.create(Protobone.Model, {
					idAttribute: 'myId'
				});
				var m1 = new Protobone.Model();
				var m2 = new M2();

				expect(m1.idAttribute).toEqual('id');
				expect(m2.idAttribute).toEqual('myId');
				expect(Protobone.Model.prototype.idAttribute).toEqual('id');
				expect(M2.prototype.idAttribute).toEqual('myId');
			});
		});

		describe("#constructor", function() {
			it("should set the delivered data as attributes", function() {
				spyOn(Protobone.Model.prototype, 'set');
				var a = new Protobone.Model({
					id: 4,
					name: 'Alex',
					active: true
				});

				expect(Protobone.Model.prototype.set).toHaveBeenCalledWith({
					id: 4,
					name: 'Alex',
					active: true
				});
			});
		});

		describe("#setId", function() {
			it("should set the ID both on the object an as attribute", function() {
				var a = new Protobone.Model();
				a.setId(5);
				expect(a.id).toEqual(5);
				expect(a.get('id')).toEqual(5);
			});

			it("returns itself (this, fluent interface)", function() {
				var m = new Protobone.Model();
				var ret = m.setId(4);
				expect(ret).toEqual(m);
			});
		});


		describe("#getId", function() {
			it("exists", function() {
				expect(Protobone.Model.prototype.getId).toEqual(jasmine.any(Function));
			});

			it("returns the actual ID", function() {
				var m = new Protobone.Model({
					id: 5
				});
				expect(m.getId()).toEqual(5);
			});
			it("returns the null if the actual ID is not set", function() {
				var m = new Protobone.Model();
				expect(m.getId()).toEqual(null);
			});
		});
	});
});

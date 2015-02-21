describe("Protobone.Model", function() {
	describe("#parse", function() {
		it("exists", function() {
			expect(Protobone.Model.prototype.parse).toEqual(jasmine.any(Function));
		});


		it("parses the response correctly and sets the data", function(){
			var m = new Protobone.Model();
			var response = {
				responseJSON: {
					id: 5,
					name: 'test',
					active: true
				}
			};
			m.parse(response);
			expect(m.getId()).toEqual(5);
			expect(m.get()).toEqual({
				id:5,name:'test',active: true
			});
		});
	});
});

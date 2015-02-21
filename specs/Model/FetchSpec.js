describe("Protobone.Model", function() {
	describe("#fetch", function() {
		it("exists", function() {
			expect(Protobone.Model.prototype.fetch).toEqual(jasmine.any(Function));
		});

		it("throws an error for new models", function() {
			var m = new Protobone.Model();
			m.urlRoot = '/MyModel';
			expect(m.fetch.bind(m)).toThrowError('Cannot be called for new Models');

		});

		it("calls sync for existing models correctly", function() {
			var m = new Protobone.Model({id: 5});
			m.urlRoot = '/MyModel';
			spyOn(m,'sync');
			m.fetch();
			expect(m.sync).toHaveBeenCalledWith('/MyModel/5','read',m,jasmine.any(Object));
		});

		it("calls parse after save was successful", function() {
			var m = new Protobone.Model({id: 5});
			var response = {some:'response'};

			m.urlRoot = '/MyModel';
			spyOn(m,'sync').and.callFake(function(url,method,model,opts) {
				opts.onSuccess(response);
			});
			spyOn(m,'parse');
			m.fetch();
			expect(m.parse).toHaveBeenCalledWith(response);
		});

		it("calls given callback after save was successful", function() {
			var m = new Protobone.Model({id: 5});
			var response = {some:'response'};
			var succCallback = jasmine.createSpy('Success Callback');

			m.urlRoot = '/MyModel';
			spyOn(m,'sync').and.callFake(function(url,method,model,opts) {
				opts.onSuccess(response);
			});
			m.fetch({onSuccess: succCallback});
			expect(succCallback).toHaveBeenCalledWith(response,m);
		});
	});
});

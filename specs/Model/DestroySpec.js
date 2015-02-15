describe("Prototype.Model", function() {
	describe("#destroy", function() {
		it("exists", function() {
			expect(Prototype.Model.prototype.destroy).toEqual(jasmine.any(Function));
		});

		it("throws an error for new models", function() {
			var m = new Prototype.Model();
			m.urlRoot = '/MyModel';
			expect(m.destroy.bind(m)).toThrowError('Cannot be called for new Models');

		});

		it("calls sync for existing models correctly", function() {
			var m = new Prototype.Model({id: 5});
			m.urlRoot = '/MyModel';
			spyOn(m,'sync');
			m.destroy();
			expect(m.sync).toHaveBeenCalledWith('/MyModel/5','delete',m,jasmine.any(Object));
		});

		it("calls parse after save was successful", function() {
			var m = new Prototype.Model({id: 5});
			var response = {some:'response'};

			m.urlRoot = '/MyModel';
			spyOn(m,'sync').and.callFake(function(url,method,model,opts) {
				opts.onSuccess(response);
			});
			spyOn(m,'parse');
			m.destroy();
			expect(m.parse).toHaveBeenCalledWith(response);
		});

		it("calls given callback after save was successful", function() {
			var m = new Prototype.Model({id: 5});
			var response = {some:'response'};
			var succCallback = jasmine.createSpy('Success Callback');

			m.urlRoot = '/MyModel';
			spyOn(m,'sync').and.callFake(function(url,method,model,opts) {
				opts.onSuccess(response);
			});
			m.destroy({onSuccess: succCallback});
			expect(succCallback).toHaveBeenCalledWith(response,m);
		});
	});
});
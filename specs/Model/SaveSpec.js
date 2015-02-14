describe("Prototype.Model", function() {
	describe("#save", function() {
		it("exists", function() {
			expect(Prototype.Model.prototype.save).toEqual(jasmine.any(Function));
		});

		it("calls sync for new models correctly", function() {
			var m = new Prototype.Model();
			m.urlRoot = '/MyModel';
			spyOn(m,'sync');
			m.save();
			expect(m.sync).toHaveBeenCalledWith('/MyModel','create',m,jasmine.any(Object));
		});

		it("calls sync for existing models correctly", function() {
			var m = new Prototype.Model({id: 5});
			m.urlRoot = '/MyModel';
			spyOn(m,'sync');
			m.save();
			expect(m.sync).toHaveBeenCalledWith('/MyModel/5','update',m,jasmine.any(Object));
		});

		it("calls parse after save was successful", function() {
			var m = new Prototype.Model({id: 5});
			var response = {some:'response'};

			m.urlRoot = '/MyModel';
			spyOn(m,'sync').and.callFake(function(url,method,model,opts) {
				opts.onSuccess(response);
			});
			spyOn(m,'parse');
			m.save();
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
			m.save({onSuccess: succCallback});
			expect(succCallback).toHaveBeenCalledWith(response,m);
		});
	});


	describe("#sync", function() {
		it("exists", function() {
			expect(Prototype.Model.prototype.sync).toEqual(jasmine.any(Function));
		});

		it("just calls Prototype.Model.sync with the correct context", function() {
			var m = new Prototype.Model();
			spyOn(Prototype.Model,'sync').and.callFake(function() {
				return this;
			});
			var proofThis = m.sync(1,2,3);

			expect(Prototype.Model.sync).toHaveBeenCalledWith(1,2,3);
			expect(proofThis).toEqual(Prototype.Model);
		});
	});
});
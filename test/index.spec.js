var expect = require('chai').expect;
var request = require('supertest');

describe('App Index', function () {
	var server, response;
	
	beforeEach(function () {
		server = undefined;
		response = undefined;
	});
	beforeEach(function () {
		server = require('../index')(false);
	});
	
	describe('when calling an unknown url', function () {
		beforeEach(function () {
			response = request(server)
				.get('/invalid/')
			;
		});
		
		it('should respond with not found', function () {
			response.end(function (err, res) {
				expect(res.status).to.equal(404);
				expect(res.body).to.be.empty;
			});
		});
	});
	
	describe('when calling search api with string', function () {
		beforeEach(function () {
			response = request(server)
				.get('/search/test')
			;
		});
		
		it('should respond successfully', function () {
			response.end(function (err, res) {
				expect(res.status).to.equal(200);
				expect(res.body).to.have.length(0);
			});
		});
	});
	
	describe('when calling search api without a string', function () {
		beforeEach(function () {
			response = request(server)
				.get('/search')
			;
		});
		
		it('should respond with 400', function () {
			response.end(function (err, res) {
				expect(res.status).to.equal(400);
				expect(res.body).to.be.empty;
			});
		});
	});
})
var expect = require('chai').expect;
var request = require('supertest');
var fakeWordList = require('./fake-word-list');
var realWordList = require('word-list-json');

describe('App Index', function () {
	var server, app, response;
	
	beforeEach(function () {
		server = undefined;
		app = undefined;
		response = undefined;
	});
	beforeEach(function () {
		server = require('../index');
		app = require('../index').app(false);
	});
	
	describe('when calling an unknown url', function () {
		beforeEach(function () {
			response = request(app)
				.get('/invalid/')
			;
		});
		
		it('should respond with not found', function (done) {
			response.end(function (err, res) {
				expect(res.status).to.equal(404);
				expect(res.body).to.be.empty;
				done();
			});
		});
	});
	
	describe('when using search api with an empty dictionary', function () {
		describe('and calling search api with string', function () {
			beforeEach(function () {
				response = request(app)
					.get('/search/test')
				;
			});
			
			it('should respond successfully', function (done) {
				response.end(function (err, res) {
					expect(res.status).to.equal(200);
					expect(res.body).to.have.length(0);
					done();
				});
			});
		});
		
		describe('and calling search api without a string', function () {
			beforeEach(function () {
				response = request(app)
					.get('/search')
				;
			});
			
			it('should respond with invalid request', function (done) {
				response.end(function (err, res) {
					expect(res.status).to.equal(400);
					expect(res.body).to.be.empty;
					done();
				});
			});
		});
	});
	
	describe('when populating dictionary', function () {
		describe('and posting nothing', function () {
			beforeEach(function () {
				response = request(app)
					.post('/dictionary')
				;
			});
			
			it('should respond with invalid request', function (done) {
				response.end(function (err, res) {
					expect(res.status).to.equal(400);
					expect(res.body).to.be.empty;
					done();
				});
			});
		});
		
		describe('and posting invalid data', function () {
			beforeEach(function () {
				response = request(app)
					.post('/dictionary')
					.send({'test': 'not-an-array'})
				;
			});
			
			it('should respond with invalid request', function (done) {
				response.end(function (err, res) {
					expect(res.status).to.equal(400);
					expect(res.body).to.be.empty;
					done();
				});
			});
		});
		
		describe('and posting valid array of words but with an object mixed in', function () {
			beforeEach(function () {
				response = request(app)
					.post('/dictionary')
					.send(['foo', 'bar', 'Chesley', 'chesley', 'test', 'barbie', {'object': true}, 'chess'])
				;
			});
			
			it('should respond with success and no results', function (done) {
				response.end(function (err, res) {
					expect(res.status).to.equal(204);
					expect(res.body).to.be.empty;
					done();
				});
			});
			it('should have correct number of results', function (done) {
				response.end(function (err, res) {
					expect(server.dictionary).to.have.length(6);
					done();
				});
			});
			it('should have no duplicates and ignore object given and should all be lowercase', function (done) {
				response.end(function (err, res) {
					expect(server.dictionary).to.deep.equal(['foo', 'bar', 'chesley', 'test', 'barbie', 'chess']);
					done();
				});
			});
		});
		
		describe('and posting valid array of words but with a sentenced mixed in', function () {
			beforeEach(function () {
				response = request(app)
					.post('/dictionary')
					.send(['foo', 'bar', 'Chesley', 'chesley', 'test', 'barbie', 'this is a sentence', 'chess'])
				;
			});
			
			it('should respond with success and no results', function () {
				response.end(function (err, res) {
					expect(res.status).to.equal(204);
					expect(res.body).to.be.empty;
				});
			});
			it('should have correct number of results', function (done) {
				response.end(function (err, res) {
					expect(server.dictionary).to.have.length(6);
					done();
				});
			});
			it('should have no duplicates and ignore object given and should all be lowercase', function (done) {
				response.end(function (err, res) {
					expect(server.dictionary).to.deep.equal(['foo', 'bar', 'chesley', 'test', 'barbie', 'chess']);
					done();
				});
			});
		});
		
		describe('and posting valid array of words', function () {
			beforeEach(function () {
				response = request(app)
					.post('/dictionary')
					.send(['foo', 'bar', 'Chesley', 'chesley', 'test', 'barbie', 'chess'])
				;
			});
			
			it('should respond with success and no results', function (done) {
				response.end(function (err, res) {
					expect(res.status).to.equal(204);
					expect(res.body).to.be.empty;
					done();
				});
			});
			it('should have correct number of results', function (done) {
				response.end(function (err, res) {
					expect(server.dictionary).to.have.length(6);
					done();
				});
			});
			it('should have no duplicates and should all be lowercase', function (done) {
				response.end(function (err, res) {
					expect(server.dictionary).to.deep.equal(['foo', 'bar', 'chesley', 'test', 'barbie', 'chess']);
					done();
				});
			});
			
			describe('then using search api', function () {
				describe('and calling search api with string', function () {
					describe('and result does NOT exist', function () {
						beforeEach(function () {
							response = request(app)
								.get('/search/not-found')
							;
						});
						
						it('should respond with success and no results', function (done) {
							response.end(function (err, res) {
								expect(res.status).to.equal(200);
								expect(res.body).to.have.length(0);
								done();
							});
						});
					});
					
					describe('and result does exist', function () {
						beforeEach(function () {
							response = request(app)
								.get('/search/test')
							;
						});
						
						it('should respond with success and one result', function (done) {
							response.end(function (err, res) {
								expect(res.status).to.equal(200);
								expect(res.body).to.have.length(1);
								expect(res.body[0]).to.equal('test');
								done();
							});
						});
					});
					
					describe('and multiple results exist', function () {
						beforeEach(function () {
							response = request(app)
								.get('/search/bar')
							;
						});
						
						it('should respond with success and two results', function (done) {
							response.end(function (err, res) {
								expect(res.status).to.equal(200);
								expect(res.body).to.have.length(2);
								expect(res.body[0]).to.equal('bar');
								expect(res.body[1]).to.equal('barbie');
								done();
							});
						});
					});
					
					describe('and multiple results exist in different cases', function () {
						beforeEach(function () {
							response = request(app)
								.get('/search/ches')
							;
						});
						
						it('should respond with success and two results', function (done) {
							response.end(function (err, res) {
								expect(res.status).to.equal(200);
								expect(res.body).to.have.length(2);
								done();
							});
						});
						it('should have results in lower case', function (done) {
							response.end(function (err, res) {
								expect(res.body[0]).to.equal('chesley');
								expect(res.body[1]).to.equal('chess');
								done();
							});
						});
					});
				});
				
				describe('and calling search api without a string', function () {
					beforeEach(function () {
						response = request(app)
							.get('/search')
						;
					});
					
					it('should respond with invalid request', function (done) {
						response.end(function (err, res) {
							expect(res.status).to.equal(400);
							expect(res.body).to.be.empty;
							done();
						});
					});
				});
			});
		});
		
		describe('and posting VERY large array of words', function () {
			beforeEach(function () {
				response = request(app)
					.post('/dictionary')
					.send(fakeWordList)
				;
			});
			
			it('should respond successfully', function (done) {
				response.end(function (err, res) {
					expect(res.status).to.equal(204);
					expect(res.body).to.be.empty;
					done();
				});
			});
			it('should have correct number of results', function (done) {
				response.end(function (err, res) {
					expect(server.dictionary).to.have.length(168);
					done();
				});
			});
		});
		
		describe('and posting a real world array of words', function () {
			beforeEach(function () {
				response = request(app)
					.post('/dictionary')
					.send(realWordList)
				;
			});
			
			it('should respond successfully', function (done) {
				response.end(function (err, res) {
					expect(res.status).to.equal(204);
					expect(res.body).to.be.empty;
					done();
				});
			});
			it('should have correct number of results', function (done) {
				response.end(function (err, res) {
					expect(server.dictionary).to.have.length(274907);
					done();
				});
			});
		});
	});
})
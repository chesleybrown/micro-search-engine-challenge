var express = require('express');
var bodyParser = require('body-parser');
var lazy = require('lazy.js');

// typically you'd want to store this in something
// that would retain state (datastore), but for simplicity
// just going to store it in memory
module.exports.dictionary = [];

module.exports.app = function () {
	var app = express();
	
	app.use(bodyParser.json({limit: '5mb'}));
	
	app.post('/dictionary', function (req, res) {
		var result = [];
		
		if (!Array.isArray(req.body)) {
			res.status(400).end();
			return;
		}
		
		// validate data given, convert all words to lowercase
		var uniqueDictionary = {};
		lazy(req.body)
			.each(function (word) {
				// only allow string words and don't allow any strings with spaces
				if (typeof word === 'string' && !/\s/.test(word)) {
					word = word.toLowerCase();
					uniqueDictionary[word] = word;
				}
			})
		;
		
		// clear
		module.exports.dictionary = [];
		
		// flatten into simple array dictionary
		lazy(uniqueDictionary)
			.flatten()
			.each(function (word) {
				module.exports.dictionary.push(word);
			})
		;
		
		res.status(204).end();
	});
	
	app.get('/search/:string?', function (req, res) {
		var result = [];
		var string = req.param('string');
		
		// must provide a valid string to search with
		if (!string) {
			res.status(400).end();
			return;
		}
		
		lazy(module.exports.dictionary)
			.filter(function (word) {
				// find words that begin with string given
				return (word.indexOf(string) === 0);
			})
			.each(function (word) {
				result.push(word);
			})
		;
		
		res.json(result);
	});
	
	return app;
};

var listen;

// basic arg parse so we can server initializing into the same file as the app module
process.argv.forEach(function (val, index, array) {
	if (index === 2 && val == 'listen') {
		listen = true;
	}
});

if (listen) {
	// get port using environment variable or use default 8000
	var port = (process.env.PORT) ? process.env.PORT : 8000;
	
	var server = module.exports.app().listen(port, function () {
		var host = server.address().address;
		console.log('Listening at http://%s:%s', host, port)
	});
}
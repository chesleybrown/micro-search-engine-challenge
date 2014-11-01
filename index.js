var express = require('express');
var bodyParser = require('body-parser');

module.exports = function () {
	var app = express();
	
	app.use(bodyParser.json());
	
	app.post('/dictionary', function (req, res) {
		var result = [];
		var dictionary = res.body;
		
		if (!Array.isArray(dictionary)) {
			res.status(400).end();
			return;
		}
		
		res.json(result);
	});
	
	app.get('/search/:string?', function (req, res) {
		var result = [];
		var string = req.param('string');
		
		// must provide a valid string to search with
		if (!string) {
			res.status(400).end();
			return;
		}
		
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
	
	var server = module.exports().listen(port, function () {
		var host = server.address().address;
		console.log('Listening at http://%s:%s', host, port)
	});
}
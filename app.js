// Dependencies
var express = require('express');
var request = require('request');
var cfenv = require('cfenv');

// Weather Instance and weather limitation variables
var weatherIntervalID = 0;
var timesGetWeatherCalled = 0;
var weatherVar = require('./weather.js');
var weatherVarInstance = new weatherVar();

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

app.get('/process_get', function(req, res)
{
	// Prepare output in JSON format
	response = {
		lat1: req.query.latitude1,
		long1: req.query.longitude1,
		lat2: req.query.latitude2,
		long2: req.query.longitude2
	};

    timesGetWeatherCalled = 0;	
	weatherIntervalID = setInterval(function() {
		weatherVarInstance.getWeather(request, response);
	}, 10000);
});


// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

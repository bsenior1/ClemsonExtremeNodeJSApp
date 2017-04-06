// Weather Functionality
var weatherSetup = function(deviceClient) {
	// Self Referentiation
	var self = this;

	// Variables for Limiting the Quantity of Weather Based Information Responses
	var timesGetWeatherCalled = 0;
	self.weatherIntervalID = 0;


	// Function to publish forecast information to IOT Device
	self.getWeather = function(request, response)
	{
		// Disconnect from Device after N iterations
		if (timesGetWeatherCalled > 3)
		{
			clearInterval(self.weatherIntervalID);
			//deviceClient.disconnect();
		}
		else
		{
			console.log("WEATHER!!!");
			var callURL = "https://8d06e217-8e7e-49ca-91d9-8f1dd6f85d88:TAao24v59K@twcservice.mybluemix.net/api/weather/v1/geocode/" + response.lat1 + "/" + response.long1 + "/forecast/hourly/48hour.json?units=m&language=en-US";
			request.get(callURL, {
				json: true
			},
			function (error, response, body) {
				console.log("forecast: " + JSON.stringify(body.forecasts[0]));
				deviceClient.publish("status", "json", JSON.stringify(body.forecasts[0]));
			});
		}
		++timesGetWeatherCalled;
	}
}

module.exports = weatherSetup;


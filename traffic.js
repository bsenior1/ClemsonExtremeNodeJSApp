// Traffic Functionality
var trafficSetup = function() {
	// Self Referentiation
	var self = this;

	// Variables for Limiting the Quantity of Traffic Based Information Responses
	var timesGetTrafficCalled = 0;
	self.trafficIntervalID = 0;

	// Function to publish traffic information to IOT Device
	self.getTraffic = function(request, response, deviceClient)
	{
		// Disconnect from Device after N iterations
		if (timesGetTrafficCalled > 3)
		{
			clearInterval(self.trafficIntervalID);
		}
		else
		{
			var locationString = "";
			//According to bing api documentation schema is (South Latitude, West Longitude, North Latitude, East Longitude)
			locationString += response.lat2 + "," + response.long1 + "," + response.lat1 + "," + response.long2;
			
			var trafficURL = "http://dev.virtualearth.net/REST/v1/Traffic/Incidents/"+locationString+"?key=Akl3RNr5drLME8fYbDEpoi--QuIbaK3aIgFZR7oycJ5TdY12QYZMs4D81I9TgzEX"
			request.get(trafficURL, {
				json: true
			},
			function (error, response, body) {
				// Note: for just traffic data use body.resourceSets 
				// New api key is required
				console.log("traffic: " + JSON.stringify(body));
				deviceClient.publish("status", "json", JSON.stringify(body));
			});	
		}
		++timesGetTrafficCalled;
	}
}

module.exports = trafficSetup;
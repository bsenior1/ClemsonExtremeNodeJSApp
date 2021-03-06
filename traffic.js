// Traffic Functionality
var trafficSetup = function(deviceClient) {
	// Self Referentiation
	var self = this;

	// Variables for Limiting the Quantity of Traffic Based Information Responses
	var timesGetTrafficCalled = 0;
	self.trafficIntervalID = 0;

	// Function to publish traffic information to IOT Device
	self.getTraffic = function(request, response)
	{
		// Disconnect from Device after N iterations
		if (timesGetTrafficCalled > 3)
		{
			clearInterval(self.trafficIntervalID);
			timesGetTrafficCalled = 0;
		}
		else
		{
			var locationString = "";
			//According to bing api documentation schema is (South Latitude, West Longitude, North Latitude, East Longitude)
			locationString += response.lat2 + "," + response.long1 + "," + response.lat1 + "," + response.long2;
			
			var trafficURL = "http://dev.virtualearth.net/REST/v1/Traffic/Incidents/"+locationString+"?key=Aq6MYE72lWQ2P7-hBJ9wvKkiGkPj5BlfKKtZo8tfYMuoaEqDxO70ckYb26iViXhL"
			request.get(trafficURL, {
				json: true
			},
			function (error, response, body) {
				// Note: for just traffic data use body.resourceSets 
				// New api key is required
				console.log("traffic: " + JSON.stringify(body.resourceSets[0]));
				deviceClient.publish("status","json",'{"d":{"type" : "traffic", "description" : '+body.resourceSets[0].description+',"severity" : '+body.resourceSets[0].severity+'}}',1);
			});	
		}
	}
}

module.exports = trafficSetup;
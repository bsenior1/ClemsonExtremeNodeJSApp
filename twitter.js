var twitterSetup = function() 
{
	// Self Referentiation
	var self = this;
	
	// Dependencies
	var Twitter = require('twitter');
	
	// Variables for Limiting the Quantity of Twitter Based Information Responses
	var timesGetTwitterCalled = 0;
	self.twitterIntervalID = 0;
	
	var twitterClient = new Twitter({
        consumer_key: 'uyGpIwSq2QmEjok8qsvAtwCW0',
        consumer_secret: 'P1Jona5WwUE54WF8LjQHE8ZJa2zK7wKmLGTj8WPZyGHqeMhxHl',
        access_token_key: '132337921-mWzwmPzlpWS9m5B7pw7T3VIWIgkPQQYUVkuGJqTG',
        access_token_secret: 'waoDLEZrg14hV2dox0FwTUs4Qv5C3ReajWOtVnlLVigUM'
    });
	
	self.getTwitter = function(request, response) 
	{
		// Stop Repetition after N iterations
		if (timesGetTwitterCalled > 3)
		{ 
			clearInterval(self.twitterIntervalID);
		}
		else 
		{
			++timesGetTwitterCalled;
			console.log("Twitter");
			var locationString = "";
			locationString += response.long1 + "," + response.lat1 + "," + response.long2 + "," + response.lat2;
			
			var stream = twitterClient.stream("statuses/filter", { track: 'javascript' });
			stream.on("data", function(event) {
				console.log(event && event.text);
				console.log("twitter end");
				//deviceClient.publish("status", "json", '{"d": {"text": ' + event.text + '}}');
			});
			
			stream.on('error', function(error) {
				throw error;
			});
		}
	}
}

module.exports = twitterSetup;
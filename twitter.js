var twitterSetup = function(deviceClient, trafficVarInstance, weatherVarInstance) 
{
	var watson = require('watson-developer-cloud');
	var tone_analyzer = watson.tone_analyzer({
		username: '078725df-30c4-4cd2-9a9e-a66a09b74125',
		password: 'yhYMQTt17GqJ',
		version: 'v3',
		version_date: '2016-05-19'
	});
	
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
		if (timesGetTwitterCalled > 1)
		{ 
			clearInterval(self.twitterIntervalID);
		}
		else 
		{
			var locationString = "";
			locationString += response.long1 + "," + response.lat2 + "," + response.long2 + "," + response.lat1;
			
			// NOTE: tweets are in a stream format
			var stream = twitterClient.stream("statuses/filter", { locations: locationString });
			stream.on('data', function(event) {
				tone_analyzer.tone({ text: event.text },
				  function(err, tone) {
					if (err)
					  console.log(err);
					else
					//	console.log('{"d":{"type" : "twitter", "text" : ' + "\"" + event.text + "\"" 
					//+ ", \"anger\" : " + tone.document_tone.tone_categories[0].tones[0].score
					//+ ", \"disgust\" : " + tone.document_tone.tone_categories[0].tones[1].score
					//+ ", \"fear\" : " + tone.document_tone.tone_categories[0].tones[2].score
					//+ ", \"joy\" : " + tone.document_tone.tone_categories[0].tones[3].score
					//+ ", \"sadeness\" : " + tone.document_tone.tone_categories[0].tones[4].score + '}}');
					
					deviceClient.publish("status","json", '{"d":{"type" : "twitter", "text" : ' + '"' + event.text + '"'
					+ ', "anger" : ' + tone.document_tone.tone_categories[0].tones[0].score
					+ ', "disgust" : ' + tone.document_tone.tone_categories[0].tones[1].score
					+ ', "fear" : ' + tone.document_tone.tone_categories[0].tones[2].score
					+ ', "joy" : ' + tone.document_tone.tone_categories[0].tones[3].score
					+ ', "sadeness" : ' + tone.document_tone.tone_categories[0].tones[4].score + '}}');
					
					
					weatherVarInstance.getWeather(request, response);
					trafficVarInstance.getTraffic(request, response);
					  //console.log(JSON.stringify(tone, null, 2));
				});
				
				
				console.log(event && event.text);
				//deviceClient.publish("status","json", '{"d":{"type" : "twitter", "text" : ' + "\"" + event.text + '}}');
			});
			
			stream.on('error', function(error) {
				console.log("Error: " + error);
			});
		}
	}
}

module.exports = twitterSetup;
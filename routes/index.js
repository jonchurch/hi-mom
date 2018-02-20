var express = require('express');
var router = express.Router();

var foursquare = require('../foursquare')

/* GET home page. */
router.get('/map', function(req, res, next) {
	// get our map data from foursquare!
	//
  res.render('map', { venues: [true] });
});

router.get('/data', (req, res) => {
	// foursquare.Users.getCheckins('self',{limit: 30}, process.env.ACCESS_TOKEN, (err, data) => {
	const today = new Date()
	const thirtyDaysAgo = Math.floor(new Date().setDate(today.getDate()-30) / 1000)
	console.log({thirtyDaysAgo})
	foursquare.Users.getVenueHistory('self',{afterTimestamp: thirtyDaysAgo }, process.env.ACCESS_TOKEN, (err, data) => {
		if (err) {
			res.send(err)
			console.log({err})
		} else {
			// console.log(data.checkins.items.length)
			res.send(data)
			// so now for the map, I want to crunch the data down to unique venues I have checked into
			// I want venues data, where I de-dupe the checkins (maybe theres an API call for this?)
				// Okay so there IS a api call to grab my venue history, dunno if that's what I want though, grrr
		}

	})
})

// shouldnt need the login, it's just a hack to get my ACCESS_TOKEN for now
router.get('/login', function(req, res) {
  res.writeHead(303, { 'location': foursquare.getAuthClientRedirectUrl() });
  res.end();
});


router.get('/callback', function (req, res) {
  foursquare.getAccessToken({
    code: req.query.code
  }, function (error, accessToken) {
    if(error) {
      res.send('An error was thrown: ' + error.message);
    }
    else {
		// grab this outta console and save to .env 
		console.log({accessToken})
		res.send('success!')
    }
  });
});

module.exports = router;

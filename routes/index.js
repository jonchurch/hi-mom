var express = require('express');
var router = express.Router();

var foursquare = require('../foursquare')

router.get('/timeline', function(req, res, next) {
	// lets check it daw
	const today = new Date()
	const thirtyDaysAgo = Math.floor(new Date().setDate(today.getDate()-30) / 1000)
	foursquare.Users.getCheckins('self', {afterTimestamp: thirtyDaysAgo}, process.env.ACCESS_TOKEN, (err, data) => {
		if (err) {
			res.send(err)
		} else {
			console.log({data})
			res.render('timeline', {checkins: data.checkins.items})
		}
	})
	
});

router.get('/map', (req, res) => {
	// foursquare.Users.getCheckins('self',{limit: 30}, process.env.ACCESS_TOKEN, (err, data) => {
	const today = new Date()
	// @TODO currently only getting 7 days worth of data, so as to center in CNX
	const thirtyDaysAgo = Math.floor(new Date().setDate(today.getDate()-7) / 1000)
	console.log({thirtyDaysAgo})
	foursquare.Users.getVenueHistory('self',{afterTimestamp: thirtyDaysAgo }, process.env.ACCESS_TOKEN, (err, data) => {
		if (err) {
			res.send(err)
			console.log({err})
		} else {
			// console.log(data.checkins.items.length)
			console.log(data.venues.items[0])
			res.render('map', { venues: data.venues.items });
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

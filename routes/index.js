var express = require('express');
var router = express.Router();

var foursquare = require('../foursquare')

router.get('/', (req, res, next) => {

	const today = new Date()
	const daysAgo = Math.floor(new Date().setDate(today.getDate()-7) / 1000)

	foursquare.Users.getCheckins('self', {afterTimestamp: daysAgo, limit: 100}, process.env.ACCESS_TOKEN, (err, checkins) => {
		if (err) {
			res.send(err)
		} else {
			foursquare.Users.getVenueHistory('self',{afterTimestamp: daysAgo}, process.env.ACCESS_TOKEN, (err, venues) => {
				if (err) {
					res.send(err)
					console.log({err})
				} else {
					res.render('main', { 
						venues: venues.venues.items,
						checkins: checkins.checkins.items
					});
				}

			})
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
		res.send({accessToken})
    }
  });
});

module.exports = router;

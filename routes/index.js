var express = require('express');
var router = express.Router();

var foursquare = require('../foursquare')

var cryptography = require('../global/cryptography')

router.get('/', (req, res, next) => {

 const today = new Date()
 const daysAgo = Math.floor(new Date().setDate(today.getDate() - 7) / 1000)
 const rawCookie = String(req.cookies['fsq_access_token'])

 if (rawCookie !== 'undefined' && rawCookie) {
  //do stuff if query is defined and not null
  const accessToken = cryptography.decrypt(rawCookie)
  foursquare.Users.getCheckins('self', { afterTimestamp: daysAgo, limit: 100 }, accessToken, (err, checkins) => {
   if (err) {
    res.send(err)
   } else {
    foursquare.Users.getVenueHistory('self', { afterTimestamp: daysAgo }, accessToken, (err, venues) => {
     if (err) {
      res.send(err)
      console.log({ err })
     } else {
      res.render('main', {
       venues: venues.venues.items,
       checkins: checkins.checkins.items
      });
     }

    })
   }
  })
 }
 else {
  res.redirect('/login')
 }
})


foursquare.Users.getCheckins('self', { afterTimestamp: daysAgo, limit: 100 }, process.env.ACCESS_TOKEN, (err, checkins) => {
 if (err) {
  res.send(err)
 } else {
  foursquare.Users.getVenueHistory('self', { afterTimestamp: daysAgo }, process.env.ACCESS_TOKEN, (err, venues) => {
   if (err) {
    res.send(err)
    console.log({ err })
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
router.get('/login', function (req, res) {
 res.writeHead(303, { 'location': foursquare.getAuthClientRedirectUrl() });
 res.end();
});

// logout user
router.get('/logout', function (req, res) {
 cookie = req.cookies;
 for (var prop in cookie) {
  if (!cookie.hasOwnProperty(prop)) {
   continue;
  }
  res.cookie(prop, '', { expires: new Date(0) });
 }
 res.status('200')
 res.send('You have logged out')
});

// setup callback to redirect user back to map upon auth
router.get('/callback', function (req, res) {
 foursquare.getAccessToken({
  code: req.query.code
 }, function (error, accessToken) {
  if (error) {
   res.send('An error was thrown: ' + error.message);
  }
  else {
   res.cookie('fsq_access_token', cryptography.encrypt(String(accessToken)), { maxAge: 900000, httpOnly: true });
   res.redirect('/')
   // grab this outta console and save to .env 
   console.log({ accessToken })
   res.send({ accessToken })
  }
 });
});

module.exports = router;

var config = {
  'secrets' : {
    'clientId' : process.env.CLIENT_ID,
    'clientSecret' : process.env.CLIENT_SECRET,
    'redirectUrl' : process.env.REDIRECT
  }
}

const foursquare = require('node-foursquare')(config)

// returns JSON checkin data from foursquare
exports.getCheckins = () => {

}

module.exports = foursquare

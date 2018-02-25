# Hi, Mom!

This is a simple project I created to keep my family updated on my travels. 

It uses Foursquare API to display my Swarm checkins, on a Leaflet map displaying Google Maps tiles.

It is built on Express and uses PUG templates to render the map and timeline

Clicking on a checkin will zoom you to the venue on the map

**NOTE: Currently I've hardcoded the Local Time for Thailand, until I (or someone else!) makes this dynamic, you will just have to switch it out to the Timezone you are currently in. Make the change in the `main.pug` filei**

## Setup

You will need to create a [Developer Account]() with Foursquare, and copy your CLIENT_ID and CLIENT_SECRET into your .env file. You will also need to provide a REDIRECT_URL in the form of `http://YOUR_HOST.com/callback` to snag your ACCESS_TOKEN for Swarm. Right now you'll have to visit `http:/YOU_HOST.com/login`  and copy paste the access token returned in your browser

Janky, but hey, your family just wants to know you're alive

You will need to [get a Google Maps API Token]() and paste it into the `layout.pug` file or else the map won't load for you!

That should be everything you need to do!




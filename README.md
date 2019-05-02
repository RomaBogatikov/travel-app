# Resfeber (not an another travel-app)

## Overview

The app gives the user a list of travel destinations to explore. Once logged in, the user can edit the travel destinations, create new ones, add them to favorites, and to leave comments.

## Technoligies used

The app uses JavaScript/jQuery/CSS/HTML, with a particular focus on using ExpressJS, MongoDB (with Mongoose) and demonstrating RESTful routes. NPM packages include dotenv, bcrypt, express-session, ejs, method-override, body-parser.
The app was built using Skeleton framework.
Moreover, two APIs were used:
1. [MapQuest Geocoding API](https://developer.mapquest.com/documentation/open/geocoding-api/) - to get coordinates of the city the user creates (based on the name of the city);
2. [Google Maps API](https://developers.google.com/maps/documentation/javascript/tutorial) - to display a map centered at the obtained coordinates.

## Future improvements

1. Ratings system for travel destinations

2. User profiles

3. Uploading pictures functionality (now the user can only provide URL)

The app is hosted on Heroku: [Resfeber (travel-app)](https://fathomless-chamber-12178.herokuapp.com/travel)

# Resfeber (not an another travel-app)

## Overview

The app gives the user a list of travel destinations to explore. Once logged in, the user can edit the travel destinations, create new ones, add them to favorites, and to leave comments.

## Technoligies used

The app uses JavaScript/jQuery/CSS/HTML, with a particular focus on using ExpressJS, MongoDB (with Mongoose) and demonstrating RESTful routes. NPM packages include dotenv, bcrypt, express-session, ejs, method-override, body-parser.
The app was built using Skeleton framework.
Moreover, two APIs were used:
1. [MapQuest Geocoding API](https://developer.mapquest.com/documentation/open/geocoding-api/) - to get coordinates of the city the user creates (based on the name of the city);
2. [Google Maps API](https://developers.google.com/maps/documentation/javascript/tutorial) - to display a map centered at the obtained coordinates.

## User stories
<li>When the app is loaded, the list of all destinations is displayed</li>
<li>User can edit and delete travel destinations from the list (implemented that way intentionally to let potential employers see the app works without logging in)</li>
<li>When the user clicks on the place card, the user is redirected to a show page, where comments are displayed along with a Google map centered at a particular place</li>
<li>When a user logs in, the the user is greeted using username, navbar changes to display 'New place', 'Favorites', 'Log Out' buttons and the user can create a new place, add existing places to favorites and write comments</li>
<li>When the user clicks 'Create New User Button' a sign up form is displayed.</li>
<li>When a new user signs up, the user is logged in automatically</li>
<li>When a user tries to sign up with a username that already exists, the app notifies to pick a different username</li>
<li>If a user that signed up before tries to sign up, the app notifies to go to login instead</li>
<li>If the user provides a wrong username or password, the app notifies about that</li>
<li>User password is encrypted with bcrypt</li>
<li></li>
<li></li>
<li></li>
<li></li>

## Future improvements

1. Ratings system for travel destinations

2. User profiles

3. Uploading pictures functionality (now the user can only provide URL)

The app is hosted on Heroku: [Resfeber (travel-app)](https://fathomless-chamber-12178.herokuapp.com/travel)

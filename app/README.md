# SkyPulse Weather App

A front-end SDC project built using only **HTML, CSS and JavaScript**.

## Problem Statement
Users need a simple web application that allows them to search for a city and quickly view current weather conditions and a 5-day forecast. The application also needs user authentication and an administrative module for basic user management.

## Modules

### 1. User Module
- Sign Up using Local Storage
- Login using Local Storage
- Weather search by city
- Current temperature, condition, humidity, wind speed, feels-like temperature and UV index
- 5-day forecast
- Browser location weather
- Favorite cities
- User profile
- Logout

### 2. Admin Module
- Admin login
- View registered user count
- View total favorite count
- View all registered users
- Delete normal users
- Admin-only navigation

## Technologies
- HTML5
- CSS3
- JavaScript
- CSS Grid and Flexbox
- Browser Local Storage
- Open-Meteo public weather/geocoding APIs (called directly from JavaScript; no API key required)

## Demo Admin Account
Email: `admin@skypulse.com`
Password: `admin123`

## How to Run
1. Extract the project folder.
2. Open `index.html` in a modern browser.
3. For best results, run it through VS Code Live Server. The application itself contains only HTML, CSS and JavaScript.
4. Internet access is required for live weather data.

## GitHub
Create a GitHub repository and upload:
- index.html
- style.css
- script.js
- README.md

Example Git commands:
```bash
git init
git add .
git commit -m "Initial SkyPulse weather app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/skypulse-weather-app.git
git push -u origin main
```

## Important SDC Review Explanation
**Navigation:** JavaScript listens for navigation button clicks and shows the selected module section.

**Authentication:** User accounts are stored in Local Storage under `skycast_users`. The current login session is stored under `skycast_session`.

**Favorites:** Favorite cities are stored under `skycast_favorites`, indexed by the logged-in user's ID.

**Weather:** JavaScript uses Open-Meteo geocoding to convert a city name to latitude/longitude, then requests weather data from Open-Meteo.

**UI:** CSS Grid is used for the application layout, statistics, forecast cards and admin dashboard. Flexbox is used for alignment in the sidebar/header and other components.


### Background
The professional version includes a subtle vector world-map/weather background (`world-map-bg.svg`) layered behind the dashboard. It is a local SVG asset, so the dashboard does not depend on a remote background image.

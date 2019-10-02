const getLocation = require('../services/maps-api');
const getWeather = require('../services/weather-api');

module.exports = () => (req, res, next) => {
  const { location } = req.body;
  const { address } = location;

  if(!address) {
    return next({
      statusCode: 400,
      error: 'address must be supplied'
    });
  }

  getLocation(address)
    .then(location => {
      if(!location) {
        return next({
          statusCode: 400,
          error: 'address must be resolvable to geolocation'
        });
      }

      const { latitude, longitude } = location;
      req.body.location.lat = latitude;
      req.body.location.lng = longitude;

      getWeather(latitude, longitude)
        .then(weather => {
          if(!weather) {
            return next({
              statusCode: 400,
              error: 'address does not resolve to a location with weather'
            });
          }
          if(weather.length) {
            req.body.weather = weather[0].forecast;
          } else {
            req.body.weather = weather.forecast;
          }
          next();
        });
    })
    .catch(next);
};